from django.urls import path

from . import views 

urlpatterns = [
  # new query with html table
  path('html_table/', views.jobs_with_related_categories_as_html),
  path('html_table_as_pdf/', views.jobs_with_related_categories_as_pdf),

  # table with css
  path('div_table/', views.jobs_div_table_as_html),
  path('div_table_as_pdf/', views.jobs_div_table_as_pdf),
]
