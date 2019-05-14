from django.shortcuts import render, get_object_or_404, redirect

from inventory.models import Parts, Tasks, Jobs, Categories, PartsMarkup, TasksParts, TagTypesChoices
from inventory.forms import PartsCreateForm, PartsEditForm, TasksForm, CategoriesForm, JobsForm, TagTypesChoicesForm, TasksPartsForm, GlobalMarkupForm


"""
Views to test forms. Dev only, remove later for React

"""
def tags_create(request):
  if request.method == 'POST':
    form = TagTypesChoicesForm(request.POST)
    if form.is_valid():
      form.save()
      form = TagTypesChoicesForm()
      # return redirect()
  else:
    form = TagTypesChoicesForm()

  return render(request, 'inventory_form.html', {'form': form, 'action': 'Create a tag'})


def tasksparts_create(request):
  if request.method == 'POST':
    form = TasksPartsForm(request.POST)
    if form.is_valid():
      form.save()
      form = TasksPartsForm()
      # return redirect()
  else:
    form = TasksPartsForm()

  return render(request, 'inventory_form.html', {'form': form, 'action': 'Task: Add a quantity for each Part'})


def global_markup_create(request):
  if request.method == 'POST':
    form = GlobalMarkupForm(request.POST)
    if form.is_valid():
      form.save()
      form = GlobalMarkupForm()
      # return redirect()
  else:
    form = GlobalMarkupForm()

  return render(request, 'inventory_form.html', {'form': form, 'action': 'Global Markup: Add markup percents for each tag type.'})


def global_markup_edit(request, pk):
  markup = get_object_or_404(GlobalMarkup, pk=pk)
  if request.method == 'POST':
    form = GlobalMarkupForm(request.POST, instance=markup)
    if form.is_valid():
      form.save()
      # normally returns to the item's detail page and pass in pk=part.pk
      # returning to the full list after an edit, so not required to pass in pk
      return redirect('global_markup')
  else:
    form = GlobalMarkupForm(instance=markup)
  return render(request, 'inventory_form.html', {'form': form, 'action': 'Edit a global markup.'})


def parts_create(request):
  if request.method == 'POST':
    form = PartsCreateForm(request.POST)
    if form.is_valid():
      form.save()
      form = PartsCreateForm()
      # return redirect()
  else:
    form = PartsCreateForm()

  return render(request, 'inventory_form.html', {'form': form, 'action': 'Create'})


def parts_list(request):
  objects = Parts.objects.all().values()
  headers = Parts._meta.get_fields()
  arr = [h.name for h in headers if h.name != 'tasks']

  return render(request, 'inventory_list.html', {'objects': objects, 'headers': arr})


def parts_edit(request, pk):
  part = get_object_or_404(Parts, pk=pk)
  if request.method == 'POST':
    form = PartsEditForm(request.POST, instance=part)
    if form.is_valid():
      form.save()
      # normally returns to the item's detail page and pass in pk=part.pk
      # returning to the full list after an edit, so not required to pass in pk
      return redirect('parts_list')
  else:
    form = PartsEditForm(instance=part)
  return render(request, 'inventory_form.html', {'form': form, 'action': 'Edit'})


def tasks_create(request):
  if request.method == 'POST':
    form = TasksForm(request.POST)

    if form.is_valid():
      form.save()
      form = TasksForm()
  else:
    form = TasksForm()

  return render(request, 'inventory_form.html', {'form': form})
