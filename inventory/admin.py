from django.contrib import admin
from inventory.models import Parts, Tasks, Categories, Jobs, GlobalMarkup, TagTypesChoices
# Register your models here.
admin.site.register(Parts)
admin.site.register(Tasks)
admin.site.register(Categories)
admin.site.register(Jobs)
admin.site.register(GlobalMarkup)
admin.site.register(TagTypesChoices)
