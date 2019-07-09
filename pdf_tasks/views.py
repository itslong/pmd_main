import os
from django.conf import settings
from django.http import HttpResponse, JsonResponse
# from django.shortcuts import render
# from django.template import Context
from django.template.loader import get_template
from xhtml2pdf import pisa
from decimal import *


from inventory.models import Tasks, Parts, TasksParts, GlobalMarkup


def create_parts_with_standard_retail(markup_data):
  """
  standard_retail: material_markup * part's retail cost or custom retail * markup
  custom retail overrides all.

  Returns a dict of dicts with part id as key. Added:
  standard_retail
  parts_tax
  """
  markup_percent = markup_data[1]['standard_material_markup_percent']
  parts_tax_percent = markup_data[1]['parts_tax_percent']

  parts_values = Parts.objects.values(
    'id',
    'base_part_cost',
    'retail_part_cost',
    'set_custom_part_cost',
    'custom_retail_part_cost'
  )

  parts = dict((p['id'], p) for p in parts_values)
  part_markup = 1 + Decimal(markup_percent / 100)

  for part in parts_values:
    if part['set_custom_part_cost']:
      standard_retail = Decimal(part['custom_retail_part_cost'] * part_markup)
    else:
      standard_retail = Decimal(part['retail_part_cost'] * part_markup)

    parts[part['id']].update({'standard_retail': standard_retail, 'parts_tax': parts_tax_percent})

  return parts

def tasks_calculated_labor_retail(markup_data):
  """
  subtotal_retail_task_labor: labor_retail_hourly_rate * contractor hours + labor_retail_hourly_rate * asst hours
  subtotal_retail_addon_labor: l_retail_hourly / 60 * contractor minutes + l_retail_hourly / 60 * asst mins
  fixed_labor overrides all.

  Returns a dict of dicts with task's db id as key (not task_id).
  Includes the task's misc tos retail hourly rate and standard labor markup percent.
  """

  tasks_labor_values = Tasks.objects.values(
    'id',
    'task_id',
    'task_name',
    'task_attribute',
    'tag_types_id',
    'use_fixed_labor_rate',
    'fixed_labor_rate',
    'estimated_contractor_hours',
    'estimated_contractor_minutes',
    'estimated_asst_hours',
    'estimated_asst_minutes'
    ).order_by('id')

  tasks_labor_dict = {}

  for tk in tasks_labor_values:
    key = tk['id']
    task_id = tk['task_id']
    name = tk['task_name']
    t_attr = tk['task_attribute']
    fixed_labor = tk['use_fixed_labor_rate']
    markup_id = tk['tag_types_id']
    subt_ret_task_labor = 0
    subt_ret_addon_labor = 0
    misc_tos_retail_hourly = Decimal(markup_data[markup_id]['misc_tos_retail_hourly_rate'])
    standard_labor_markup = Decimal(markup_data[markup_id]['standard_labor_markup_percent'])

    if fixed_labor:
      if t_attr == 'Addon And Task':
        subt_ret_task_labor = tk['fixed_labor_rate']
        subt_ret_addon_labor = tk['fixed_labor_rate']
      elif t_attr == 'Task Only':
        subt_ret_task_labor = tk['fixed_labor_rate']
      else:
        subt_ret_addon_labor = tk['fixed_labor_rate']
    else:
      # add misc_tos_retail_hourly_rate? to retail
      cntr_ret_hours = Decimal(markup_data[markup_id]['labor_retail_hourly_rate']) * Decimal(tk['estimated_contractor_hours'])
      asst_ret_hours = Decimal(markup_data[markup_id]['labor_retail_hourly_rate']) * Decimal(tk['estimated_asst_hours'])
      cntr_ret_mins = Decimal(markup_data[markup_id]['labor_retail_hourly_rate'] / 60) * Decimal(tk['estimated_contractor_minutes'])
      asst_ret_mins = Decimal(markup_data[markup_id]['labor_retail_hourly_rate'] / 60) * Decimal(tk['estimated_asst_minutes'])

      if t_attr == 'Addon And Task':
        subt_ret_task_labor = cntr_ret_hours + asst_ret_hours
        subt_ret_addon_labor = cntr_ret_mins + asst_ret_mins
      elif t_attr == 'Task Only':
        subt_ret_task_labor = cntr_ret_hours + asst_ret_hours
      else:
        subt_ret_addon_labor = cntr_ret_mins + asst_ret_mins

    tasks_labor_dict[key] = {
      'task_name': name,
      'task_item_id': task_id,
      'subt_ret_task_labor': subt_ret_task_labor,
      'subt_ret_addon_labor': subt_ret_addon_labor,
      'standard_labor_markup': standard_labor_markup,
      'task_misc_tos_retail_hourly': misc_tos_retail_hourly,
      'attr': t_attr,
    }

  return tasks_labor_dict

def separate_into_task_and_addon(task_dict):
  """
  return a dict with two keys: task, addon.
  task: array of objects
  addon: array of objects
  """

  data_dict = {}
  data_dict['task'] = []
  data_dict['addon'] = []

  keys = task_dict.keys()

  for key in keys:
    attr = task_dict[key]['attribute']

    if attr == 'Addon And Task':
      data_dict['task'].append(task_dict[key])
      data_dict['addon'].append(task_dict[key])
    elif attr == 'Task Only':
      data_dict['task'].append(task_dict[key])
    else:
      data_dict['addon'].append(task_dict[key])
  
  return data_dict


def calculate_task_labor_with_parts(markup_data, limiter=40):
  parts = create_parts_with_standard_retail(markup_data)
  tasks_labor = tasks_calculated_labor_retail(markup_data)
  tasksparts_values = TasksParts.objects.values('task_id', 'part_id', 'quantity').order_by('task_id')[:limiter]

  if limiter == 0:
    tasksparts_values = TasksParts.objects.values('task_id', 'part_id', 'quantity').order_by('task_id')

  task_dict = {}

  for tpv in tasksparts_values:
    tid = tpv['task_id']
    t_name = tasks_labor[tid]['task_name']
    task_id = tasks_labor[tid]['task_item_id']
    pid = tpv['part_id']
    qty = tpv['quantity']
    labor_markup = round(1 + Decimal(tasks_labor[tid]['standard_labor_markup'] / 100), 2)
    misc_tos = round(Decimal(tasks_labor[tid]['task_misc_tos_retail_hourly']), 2)
    part_obj = parts[pid]
    t_attr = tasks_labor[tid]['attr']
    part_tax = round(Decimal(part_obj['parts_tax'] / 100), 2)

    # task specific labor
    task_val_ret_labor = round(Decimal(tasks_labor[tid]['subt_ret_task_labor']), 2)
    addon_val_ret_labor = round(Decimal(tasks_labor[tid]['subt_ret_addon_labor']), 2)

    # parts * qty
    part_val_ret_subtotal = round(qty * Decimal(part_obj['retail_part_cost']), 2)
    part_std_ret_subtotal = round(qty * Decimal(part_obj['standard_retail']), 2)

    # tax aded to each part. tax only applied to value_retail
    part_val_ret_tax = round(Decimal(part_val_ret_subtotal * part_tax), 2)

    # part(and qty) + tax
    part_val_ret_total = part_val_ret_subtotal + part_val_ret_tax
    part_std_ret_total = part_std_ret_subtotal + part_val_ret_tax

    if tid in task_dict:
      t_obj = task_dict[tid]
      # t_obj['task_value_rate'] += task_total_val_ret_tax,
      t_obj['task_value_rate'] = t_obj['task_value_rate'] + part_val_ret_total
      t_obj['task_std_rate'] = t_obj['task_std_rate'] + part_std_ret_total
      t_obj['addon_value_rate'] = t_obj['addon_value_rate'] + part_val_ret_total
      t_obj['addon_std_rate'] = t_obj['addon_std_rate'] + part_std_ret_total
      # t_obj['quantity'] = t_obj['quantity'] + qty
    else:
      # labor is added only the first time
      task_dict[tid] = {}
      t_obj = task_dict[tid]
      t_obj['tid'] = tid
      t_obj['attribute'] = t_attr
      t_obj['task_id'] = task_id
      t_obj['task_name'] = t_name
      t_obj['task_value_rate'] = round(misc_tos + task_val_ret_labor + part_val_ret_total, 2)
      t_obj['task_std_rate'] = round((task_val_ret_labor * labor_markup) + misc_tos + part_std_ret_total, 2)
      t_obj['addon_value_rate'] = round(addon_val_ret_labor + part_val_ret_total, 2)
      t_obj['addon_std_rate'] = round((labor_markup * addon_val_ret_labor) + part_std_ret_total, 2)
      # t_obj['labor_markup'] = labor_markup
      # t_obj['task_val_ret_labor'] = task_val_ret_labor
      # t_obj['part_val_ret_subtotal'] = part_val_ret_subtotal
      # t_obj['part_val_ret_tax'] = part_val_ret_tax
      # t_obj['quantity'] = qty
      # t_obj['misc_tos'] = misc_tos

  task_data = separate_into_task_and_addon(task_dict)
  return task_data


# def link_callback(uri, rel):
#   """
#   Convert HTML URIs to absolute system paths so xhtml2pdf can access those
#   resources
#   """
#   # use short variable names
#   sUrl = settings.STATIC_URL      # Typically /static/
#   sRoot = settings.STATIC_ROOT    # Typically /home/userX/project_static/
#   mUrl = settings.MEDIA_URL       # Typically /static/media/
#   mRoot = settings.MEDIA_ROOT     # Typically /home/userX/project_static/media/

#   # convert URIs to absolute system paths
#   if uri.startswith(mUrl):
#       path = os.path.join(mRoot, uri.replace(mUrl, ""))
#   elif uri.startswith(sUrl):
#       path = os.path.join(sRoot, uri.replace(sUrl, ""))
#   else:
#       return uri  # handle absolute uri (ie: http://some.tld/foo.png)

#   # make sure that file exists
#   if not os.path.isfile(path):
#           raise Exception(
#               'media URI must start with %s or %s' % (sUrl, mUrl)
#           )
#   return path

# remove limiter parameter after testing
def render_pdf_view(request, limiter=40):
  markup = dict((m['id'], m) for m in GlobalMarkup.objects.values())
  tasks_data = calculate_task_labor_with_parts(markup, limiter) #default 40

  template_path = 'view_pdf.html'
  context = {
    'task': tasks_data['task'],
    'addon': tasks_data['addon']
  }
  # Create a Django response object, and specify content_type as pdf
  response = HttpResponse(content_type='application/pdf')
  # response['Content-Disposition'] = 'attachment; filename="pmd-book.pdf"'
  # find the template and render it.
  template = get_template(template_path)
  html = template.render(context)


  # create a pdf
  # pisaStatus = pisa.CreatePDF(html, dest=response, link_callback=link_callback)
  pisaStatus = pisa.CreatePDF(html, dest=response)
  # if error then show some funy view
  if pisaStatus.err:
     return HttpResponse('We had some errors <pre>' + html + '</pre>')
  return response


def render_json_view(request, limiter=0):
  markup = dict((m['id'], m) for m in GlobalMarkup.objects.values())
  custom_qs = calculate_task_labor_with_parts(markup, limiter)
  task_count = len(custom_qs['task'])
  addon_count = len(custom_qs['addon'])

  response = JsonResponse({
    'task_count': task_count, 
    'addon_count': addon_count,
    'data': custom_qs,
  })
  return response

# remove after testing. # api only
def view_100(request):
  response = render_json_view(request, limiter=100)
  return response


def view_400(request):
  response = render_json_view(request, limiter=400)
  return response

def view_all(request):
  response = render_json_view(request, limiter=0)
  return response


def render_100(request):
  pdf = render_pdf_view(request, limiter=100)
  return pdf

def render_400(request):
  pdf = render_pdf_view(request, limiter=400)
  return pdf

def render_all(request):
  pdf = render_pdf_view(request, limiter=0)
  return pdf
