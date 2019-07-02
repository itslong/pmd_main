from django.urls import path

from . import views 

urlpatterns = [
  path('book/', views.render_pdf_view),
  # test only. Remove after testing
  path('book_100/', views.view_100),
  path('book_400/', views.view_400),
  path('book_all/', views.view_all),

]
