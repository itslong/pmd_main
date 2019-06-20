from django.contrib import admin
from django.urls import path
from django.http import HttpResponseRedirect

from inventory.models import Parts, Tasks, Categories, Jobs, GlobalMarkup, TagTypesChoices, PartsMarkup
# Register your models here.
admin.site.register(Parts)
admin.site.register(Tasks)
admin.site.register(Categories)
admin.site.register(Jobs)
admin.site.register(GlobalMarkup)
admin.site.register(TagTypesChoices)


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

admin.site.register(PartsMarkup, PartsMarkupAdmin)