from django.urls import path
from knox import views as knox_views
from pmd_auth import views

urlpatterns = [
  path('api/login/', views.LoginViewAsKnox.as_view(), name='knox_login'),
  path('api/logout/', knox_views.LogoutView.as_view(), name='knox_logout'),
  path('api/logoutall/', knox_views.LogoutAllView.as_view(), name='knox_logoutall'),
]

urlpatterns += [
  path('register/', views.RegistrationView.as_view()),
  path('login/', views.LoginView.as_view()),
  path('info/', views.GetUserDataView.as_view()),
]
