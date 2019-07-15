from django.urls import path

from . import views 

urlpatterns = [
  path('book/', views.render_pdf_view),
  # test only. Remove after testing
  path('book_api_100/', views.view_100),
  path('book_api_400/', views.view_400),
  path('book_api_all/', views.view_all),

  path('book_render_100/', views.render_100),
  path('book_render_400/', views.render_400),
  path('book_render_all/', views.render_all),

  path('cat_as_pdf/', views.render_categories_as_pdf),
  # new query with html table
  path('html_table/', views.jobs_with_related_categories_as_html),
  path('html_table_as_pdf/', views.jobs_with_related_categories_as_pdf),

  # table with css
  path('div_table/', views.jobs_div_table_as_html),
  path('div_table_as_pdf/', views.jobs_div_table_as_pdf),
]
