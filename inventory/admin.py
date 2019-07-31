from django.contrib import admin
from django.urls import path
from django.http import HttpResponseRedirect

from inventory.models import Parts, Tasks, Categories, Jobs, GlobalMarkup, TagTypesChoices, PartsMarkup

admin.site.register(GlobalMarkup)
admin.site.register(TagTypesChoices)


class PartsAdmin(admin.ModelAdmin):
  list_display = ('id', 'part_name', 'master_part_num', 'is_active')
  search_fields = ('id', 'part_name', 'master_part_num')


class TasksAdmin(admin.ModelAdmin):
  list_display = ('id', 'task_id', 'task_name', 'tag_types', 'task_attribute', 'categories', 'is_active')
  search_fields = ('id', 'task_name', 'task_attribute', 'task_id')


class CategoriesAdmin(admin.ModelAdmin):
  list_display = ('id', 'category_name', 'jobs','is_active')
  search_fields = ('id', 'category_name')


class JobsAdmin(admin.ModelAdmin):
  list_display = ('id', 'job_name', 'ordering_num','is_active')
  search_fields = ('id', 'job_name')


class PartsMarkupAdmin(admin.ModelAdmin):
  change_list_template = 'change_list.html'
  list_display = ('id', 'range_low', 'range_high', 'markup_percent')

  def get_urls(self):
    urls = super().get_urls()
    custom_url = [
      path('update_part_retail_with_new_markup/', self.admin_site.admin_view(self.update_all_parts_with_new_markup_percent)),
    ]
    return custom_url + urls

  def update_all_parts_with_new_markup_percent(self, request):
    parts = Parts.objects.order_by('id').filter(set_custom_part_cost=False)
    markups = self.model.objects.values_list('id', flat=True)
    markups_obj = self.model.objects.in_bulk(markups)

    for part in parts:
      markup_percent_by_part_id = (markups_obj[int(part.markup_percent_id)].markup_percent) / 100
      new_part_retail = part.base_part_cost + (part.base_part_cost * markup_percent_by_part_id) 
      part.retail_part_cost = f'{new_part_retail:.2f}'
      part.save()

    self.message_user(request, 'Part(s) with no custom retail have been adjusted: %i' % parts.count())
    return HttpResponseRedirect('../')

admin.site.register(Parts, PartsAdmin)
admin.site.register(Tasks, TasksAdmin)
admin.site.register(Categories, CategoriesAdmin)
admin.site.register(Jobs, JobsAdmin)
admin.site.register(PartsMarkup, PartsMarkupAdmin)