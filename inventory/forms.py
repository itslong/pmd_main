from django import forms
from inventory.models import Parts, Tasks, Categories, Jobs, TagTypesChoices, TasksParts, GlobalMarkup


class PartsCreateForm(forms.ModelForm):
  class Meta:
    model = Parts
    exclude = ['id', 'is_active', 'tasks']


class PartsEditForm(forms.ModelForm):
  class Meta:
    model = Parts
    exclude = ['id']


class TasksForm(forms.ModelForm):
  class Meta:
    model = Tasks
    fields = '__all__'


class JobsForm(forms.ModelForm):
  class Meta:
    model = Jobs
    fields = '__all__'


class CategoriesForm(forms.ModelForm):
  class Meta:
    model = Categories
    fields = '__all__'


class TagTypesChoicesForm(forms.ModelForm):
  class Meta:
    model = TagTypesChoices
    fields = '__all__'


class TasksPartsForm(forms.ModelForm):
  class Meta:
    model = TasksParts
    fields = '__all__'


class GlobalMarkupForm(forms.ModelForm):
  class Meta:
    model = GlobalMarkup
    fields = '__all__'
