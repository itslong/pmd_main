from django.urls import path
from pmd_auth import views

urlpatterns = [
  path('current_user/', views.current_user),
  path('all_users/', views.UserList.as_view())
]
