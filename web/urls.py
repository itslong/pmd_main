from django.urls import re_path
from web import views

urlpatterns = [
  re_path(r'.*', views.index, name='app-home')
]
