import os
from django.conf import settings
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.db.models import Prefetch
# from django.template import Context
from django.template.loader import get_template
from xhtml2pdf import pisa
from decimal import *

from inventory.models import Tasks, Parts, TasksParts, GlobalMarkup, Categories, Jobs

'''
For historical purposes. Will delete after formula bug is squashed.
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
  )

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
      'subt_ret_task_labor': round(subt_ret_task_labor, 2),
      'subt_ret_addon_labor': round(subt_ret_addon_labor, 2),
      'standard_labor_markup': round(standard_labor_markup, 2),
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



def tasksparts_dict():
  tp_values = TasksParts.objects.values('task_id', 'part_id', 'quantity')
  tp_dict = {}

  for tp in tp_values:
    tid = tp['task_id']

    if tid not in tp_dict:
      tp_dict[tid] = {}
      tp_dict[tid] = {tp['part_id']: tp['quantity']}
    else:
      tp_dict[tid].update({tp['part_id']: tp['quantity']})

  return tp_dict


def categories_with_related_tasks():
  markup = dict((m['id'], m) for m in GlobalMarkup.objects.values())
  categories = Categories.objects.prefetch_related('tasks_set').all()
  cat_arr = []

  parts_dict = create_parts_with_standard_retail(markup)
  tasks_labor_dict = tasks_calculated_labor_retail(markup)
  tp_dict = tasksparts_dict()


  for cat in categories:
    related_tasks = cat.tasks_set.values()
    cid = cat.id
    cat_dict = {}
    cat_dict['name'] = cat.category_name
    cat_dict['id'] = cid
    cat_dict['data'] = {}
    cat_obj = cat_dict['data']
    cat_obj['task'] = []
    cat_obj['addon'] = []

    for task in related_tasks:
      # use task's db id to fetch qty from tasksparts
      tid = task['id']
      task_obj = tasks_labor_dict[tid]
      t_attr = task_obj['attr']
      task_id = task_obj['task_item_id']
      t_name = task_obj['task_name']

      misc_tos = Decimal(task_obj['task_misc_tos_retail_hourly'])
      labor_markup = round(1 + Decimal(task_obj['standard_labor_markup'] / 100), 2)

      part_vr_total = 0
      part_std_total = 0

      if tid in tp_dict:
        related_parts = tp_dict[tid].items()

        for part in related_parts:
          pid = part[0]
          qty = part[1]
          part_obj = parts_dict[pid]
          part_tax = Decimal(part_obj['parts_tax'] / 100)

          # calc value_retail subtotal and std_retail subtotal with quantity.
          part_val_ret_subtotal = round(qty * Decimal(part_obj['retail_part_cost']), 2)
          part_std_ret_subtotal = round(qty * Decimal(part_obj['standard_retail']), 2)

          # tax applied part. tax only applied to value_retail.
          part_tax_value = round(Decimal(part_val_ret_subtotal * part_tax), 2)
          
          # part(and qty) + tax
          part_val_ret_total = part_val_ret_subtotal + part_tax_value
          part_std_ret_total = part_std_ret_subtotal + part_tax_value

          part_vr_total += part_val_ret_total
          part_std_total += part_std_ret_total

      
      # calc task labor. Some tasks will not require parts so tid will not be in taskparts
      task_val_ret_labor = task_obj['subt_ret_task_labor']
      addon_val_ret_labor = task_obj['subt_ret_addon_labor']


      # calc task labor with parts
      task_value_rate = misc_tos + task_val_ret_labor + part_vr_total
      task_std_rate = (task_val_ret_labor * labor_markup) + misc_tos + part_std_total
      addon_value_rate = addon_val_ret_labor + part_vr_total
      addon_std_rate = (addon_val_ret_labor * labor_markup) + part_std_total

      # prepare task obj
      new_t_obj = {}
      new_t_obj['tid'] = tid
      new_t_obj['attribute'] = t_attr
      new_t_obj['task_id'] = task_id
      new_t_obj['task_name'] = t_name


      # separate by task attribute
      if t_attr == 'Addon And Task':
        new_t_obj['task_value_rate'] = round(task_value_rate, 2)
        new_t_obj['task_std_rate'] = round(task_std_rate, 2)
        new_t_obj['addon_value_rate'] = round(addon_value_rate, 2)
        new_t_obj['addon_std_rate'] = round(addon_std_rate, 2)
        cat_obj['task'].append(new_t_obj)
        cat_obj['addon'].append(new_t_obj)
      elif t_attr == 'Task Only':
        new_t_obj['task_value_rate'] = round(task_value_rate, 2)
        new_t_obj['task_std_rate'] = round(task_std_rate, 2)
        cat_obj['task'].append(new_t_obj)
      else:
        new_t_obj['addon_value_rate'] = round(addon_value_rate, 2)
        new_t_obj['addon_std_rate'] = round(addon_std_rate, 2)
        cat_obj['addon'].append(new_t_obj)
    cat_arr.append(cat_dict)

  return cat_arr


def render_categories_as_pdf(request):
  cat_data = categories_with_related_tasks()

  template_path = 'category_pdf.html'
  context = {
    'cat_data': cat_data
  }

  response = HttpResponse(content_type='application/pdf')
  # response['Content-Disposition'] = 'attachment; filename="pmd-book.pdf"'
  template = get_template(template_path)
  html = template.render(context)

  # create a pdf
  # pisaStatus = pisa.CreatePDF(html, dest=response, link_callback=link_callback)
  pisaStatus = pisa.CreatePDF(html, dest=response)

  if pisaStatus.err:
     return HttpResponse('We had some errors <pre>' + html + '</pre>')
  return response
'''

def calculate_task_labor_obj(task_data, markup):
  task_obj = {}
  task_obj['id'] = task_data['id']
  task_obj['task_id'] = task_data['task_id']
  task_obj['task_name'] = task_data['task_name']
  task_obj['attribute'] = task_data['task_attribute']

  if task_data['use_fixed_labor_rate']:

    fixed_rate = task_data['fixed_labor_rate']
    task_obj['task_value_rate'] = fixed_rate
    task_obj['task_std_rate'] = fixed_rate
    task_obj['addon_value_rate'] = fixed_rate
    task_obj['addon_std_rate'] = fixed_rate
    # print('fixed: data: ', task_obj)
    return task_obj

  tos = markup['misc_tos_retail_hourly_rate']
  labor_markup = 1 + Decimal(markup['standard_labor_markup_percent'] / 100)
  cntr_labor_retail = Decimal(markup['labor_retail_hourly_rate'])
  asst_labor_retail = Decimal(markup['asst_labor_retail_hourly_rate'])

  # task only
  cntr_hours = cntr_labor_retail * Decimal(task_data['estimated_contractor_hours'])
  asst_hours = asst_labor_retail * Decimal(task_data['estimated_asst_hours'])
  task_val_ret_labor = Decimal(cntr_hours + asst_hours)

  # addon only
  cntr_mins = (cntr_labor_retail / 60) * Decimal(task_data['estimated_contractor_minutes'])
  asst_mins = (asst_labor_retail / 60) * Decimal(task_data['estimated_asst_minutes'])
  addon_val_ret_labor = Decimal(cntr_mins + asst_mins)


  task_obj['task_value_rate'] = round(tos + task_val_ret_labor, 2) #+ part_vr_total
  task_obj['task_std_rate'] = round((task_val_ret_labor * labor_markup) + tos, 2) #+ part_std_total
  task_obj['addon_value_rate'] = round(addon_val_ret_labor, 2) #+ part_vr_total
  task_obj['addon_std_rate'] = round(addon_val_ret_labor * labor_markup, 2) #+ part_std_total

  return task_obj


def jobs_with_related_categories():
  markup = dict((m['id'], m) for m in GlobalMarkup.objects.values())

  jobs = Jobs.objects.prefetch_related('categories_set').order_by('ordering_num')
  # jobs = Jobs.objects.prefetch_related('categories_set')
  jobs_dict = {}

  for job in jobs:
    jobs_dict[job.job_name] = {}
    jobs_dict[job.job_name]['job_name'] = job.job_name
    jobs_dict[job.job_name]['job_data'] = {}
    related_categories = job.categories_set.all()


    for cat in related_categories:
      cat_dict = {}
      cid = cat.id
      cat_dict['id'] = cat.id
      cat_dict['category_name'] = cat.category_name
      cat_dict['headings'] = [
        cat.category_heading_one,
        cat.category_heading_two,
        cat.category_heading_three,
        cat.category_heading_four,
        cat.category_heading_five,
        cat.category_heading_six,
      ]
      # headings = cat_dict['headings']

      # if len(cat.category_heading_one.strip()) > 0:
      #   headings.append(cat.category_heading_one)
      # if len(cat.category_heading_two.strip()) > 0:
      #   headings.append(cat.category_heading_two)
      # if len(cat.category_heading_three.strip()) > 0:
      #   headings.append(cat.category_heading_three)
      # if len(cat.category_heading_four.strip()) > 0:
      #   headings.append(cat.category_heading_four)
      # if len(cat.category_heading_five.strip()) > 0:
      #   headings.append(cat.category_heading_five)
      # if len(cat.category_heading_six.strip()) > 0:
      #   headings.append(cat.category_heading_six)

      cat_dict['task'] = {}
      cat_dict['addon'] = {}

      related_tasks_and_parts = cat.tasks_set.prefetch_related('tasksparts_set').select_related('part').values(
        'id', 'task_id', 'task_name', 'task_attribute', 'tag_types', 
        'estimated_contractor_hours', 'estimated_contractor_minutes', 'estimated_asst_hours', 'estimated_asst_minutes',
        'fixed_labor_rate', 'use_fixed_labor_rate',
        'parts__id', 'parts__part_name', 'parts__retail_part_cost', 
        'parts__set_custom_part_cost', 'parts__custom_retail_part_cost', 'tasksparts__quantity'
      )

      for item in related_tasks_and_parts:
        tid = item['id']
        tag_id = item['tag_types']
        task_attr = item['task_attribute']
        markup_obj = markup[tag_id]
        part_tax = Decimal(markup_obj['parts_tax_percent'] / 100)
        qty = 0

        # calculate parts for each item
        part_markup = 1 + Decimal(markup_obj['standard_material_markup_percent'] / 100)

        # calc part standard retail or use custom retail
        if item['parts__set_custom_part_cost']:
          qty = item['tasksparts__quantity']
          part_std_retail = Decimal(item['parts__custom_retail_part_cost']) * part_markup * qty
        else:
          # some tasks may not contain parts. 
          if item['parts__retail_part_cost'] is None:
            # placeholder values for task when there are no parts.
            part_std_retail = 0
            part_val_ret_subtotal = 0
          else:
            part_std_retail = Decimal(item['parts__retail_part_cost']) * part_markup
            # re-set qty when there are parts for the task.
            qty = item['tasksparts__quantity']
            # part * qty
            part_val_ret_subtotal = qty * Decimal(item['parts__retail_part_cost'])
          
        part_std_ret_subtotal = qty * part_std_retail

        part_val_ret_tax = part_val_ret_subtotal * part_tax

        # # part(and qty) + tax
        part_val_ret_total = round(part_val_ret_subtotal + part_val_ret_tax, 2)
        part_std_ret_total = round(part_std_ret_subtotal + part_val_ret_tax, 2)


        if task_attr == 'Addon And Task':
          cat_dict['task'][tid] = cat_dict['task'].get(tid, calculate_task_labor_obj(item, markup_obj))
          cat_dict['addon'][tid] = cat_dict['addon'].get(tid, calculate_task_labor_obj(item, markup_obj))

          task_obj = cat_dict['task'][tid]
          addon_obj = cat_dict['addon'][tid]

          task_obj['task_value_rate'] = task_obj.get('task_value_rate', part_val_ret_total) + part_val_ret_total
          task_obj['task_std_rate'] = task_obj.get('task_std_rate', part_std_ret_total) +  part_std_ret_total

          addon_obj['addon_value_rate'] = addon_obj.get('addon_value_rate', part_val_ret_total) + part_val_ret_total 
          addon_obj['addon_std_rate'] = addon_obj.get('addon_std_rate', part_std_ret_total) +  part_std_ret_total
        elif task_attr == 'Task Only':
          cat_dict['task'][tid] = cat_dict['task'].get(tid, calculate_task_labor_obj(item, markup_obj))
          task_obj = cat_dict['task'][tid]

          task_obj['task_value_rate'] = task_obj.get('task_value_rate', part_val_ret_total) + part_val_ret_total
          task_obj['task_std_rate'] = task_obj.get('task_std_rate', part_std_ret_total) +  part_std_ret_total
        else:
          cat_dict['addon'][tid] = cat_dict['addon'].get(tid, calculate_task_labor_obj(item, markup_obj))
          addon_obj = cat_dict['addon'][tid]

          addon_obj['addon_value_rate'] = addon_obj.get('addon_value_rate', part_val_ret_total) + part_val_ret_total 
          addon_obj['addon_std_rate'] = addon_obj.get('addon_std_rate', part_std_ret_total) +  part_std_ret_total

      jobs_dict[job.job_name]['job_data'][cid] = cat_dict

  return jobs_dict


# uses <table>
def jobs_with_related_categories_as_html(request):
  jobs_data = jobs_with_related_categories()

  context = {
    'jobs_data': jobs_data
  }
  return render(request, 'jobs_cats_html_table_pdf.html', context)


def jobs_with_related_categories_as_pdf(request):
  jobs_data = jobs_with_related_categories()

  template_path = 'jobs_cats_html_table_pdf.html'
  context = {
    'jobs_data': jobs_data
  }

  response = HttpResponse(content_type='application/pdf')
  # response['Content-Disposition'] = 'attachment; filename="pmd-book.pdf"'
  template = get_template(template_path)
  html = template.render(context)

  # create a pdf
  # pisaStatus = pisa.CreatePDF(html, dest=response, link_callback=link_callback)
  pisaStatus = pisa.CreatePDF(html, dest=response)

  if pisaStatus.err:
     return HttpResponse('We had some errors <pre>' + html + '</pre>')
  return response



# no <table> in the html to test for performance
def jobs_div_table_as_html(request):
  jobs_data = jobs_with_related_categories()
  # print(jobs_data)
  context = {
    'jobs_data': jobs_data
  }
  return render(request, 'jobs_cats_div_table_pdf.html', context)


def jobs_div_table_as_pdf(request):
  jobs_data = jobs_with_related_categories()

  template_path = 'jobs_cats_div_table_pdf.html'
  context = {
    'jobs_data': jobs_data
  }

  response = HttpResponse(content_type='application/pdf')
  # response['Content-Disposition'] = 'attachment; filename="pmd-book.pdf"'
  template = get_template(template_path)
  html = template.render(context)

  # create a pdf
  # pisaStatus = pisa.CreatePDF(html, dest=response, link_callback=link_callback)
  pisaStatus = pisa.CreatePDF(html, dest=response)

  if pisaStatus.err:
     return HttpResponse('We had some errors <pre>' + html + '</pre>')
  return response
