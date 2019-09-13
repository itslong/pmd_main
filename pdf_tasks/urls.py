from django.urls import path

from . import views 

urlpatterns = [
  # new query with html table
  path('html_table/', views.jobs_with_related_categories_as_html),
  path('html_table_as_pdf/', views.jobs_with_related_categories_as_pdf),

  # test with jspdf
  path('jspdf_with_html/', views.jobs_with_categories_for_jspdf),
]
