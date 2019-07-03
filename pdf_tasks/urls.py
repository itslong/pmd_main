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

]
