from django.urls import path, re_path
from rest_framework.urlpatterns import format_suffix_patterns

from inventory import views, views_dev


urlpatterns = [
  path('parts/', views.PartsExcludedView.as_view()),
  path('parts/admin/', views.PartsAdminView.as_view()),
  path('part/create/', views.PartsCreate.as_view()),
  path('part/<int:pk>/', views.PartsDetailView.as_view()),
  path('part/<int:pk>/edit-only/', views.PartsEdit.as_view()),
  
  path('part/<int:pk>/edit-or-delete/', views.PartsEditOrDelete.as_view()),
  path('parts-searchable/', views.PartsSearchableList.as_view()),
  path('parts-tag-types/', views.PartsTagTypes.as_view()),
  path('parts-tag-types/<int:pk>/edit/', views.PartsEditTagTypes.as_view()),


  path('parts-markup/create/', views.PartsMarkupCreate.as_view()),
  path('parts-markup/list/', views.PartsMarkupList.as_view()),
  path('parts-markup/<int:pk>/edit-only', views.PartsMarkupEdit.as_view()),

  path('tasks/', views.TasksExcludedView.as_view()),
  path('task/create/', views.TasksCreate.as_view()),
  path('task/<int:pk>/', views.TasksDetailView.as_view()),
  path('task/<int:pk>/edit-only', views.TasksEdit.as_view()),
  path('tasks-searchable/', views.TasksSearchableList.as_view()),

  path('tasks-parts/', views.TasksPartsList.as_view()),
  path('tasks-parts/create', views_dev.tasksparts_create, name='tasksparts_create'),
  path('tasks-parts/<int:pk>/edit-only', views.TasksPartsEdit.as_view()),
  
  re_path(r'^tasks-parts/part-filter(?P<part_id>)/$', views.TasksPartsFilterByPart.as_view()),
  re_path(r'^tasks-parts/task-filter(?P<task_id>)/$', views.TasksPartsFilterByTask.as_view()),
  re_path(r'^tasks-parts/filter-then-delete(?P<task_id>)/$', views.TasksPartsViewSet.as_view({'post': 'delete_tasks_by_id'})),

  path('categories/', views.CategoriesExcludedView.as_view()),
  path('category/create/', views.CategoriesCreate.as_view()),
  path('category/<int:pk>/', views.CategoriesDetailView.as_view()),
  path('category/<int:pk>/edit-only', views.CategoriesEdit.as_view()),
  path('categories-searchable/', views.CategoriesSearchableList.as_view()),

  path('tags/', views.TagTypesView.as_view()),
  path('tags/create', views_dev.tags_create, name='tags_create'),

  path('jobs/', views.JobsExcludedView.as_view()),
  path('job/create/', views.JobsCreate.as_view()),
  path('job/<int:pk>/', views.JobsDetailView.as_view()),
  path('job/<int:pk>/edit-only', views.JobsEdit.as_view()),
  path('jobs-searchable/', views.JobsSearchableList.as_view()),

  # TODO: convert global_markup create/edit into react forms
  path('global-markup/', views.GlobalMarkupView.as_view(), name='global_markup'),
  path('global-markup/create', views_dev.global_markup_create, name='global_markup_create'),
  path('global-markup/<int:pk>/edit', views_dev.global_markup_edit, name='global_markup_edit'),

]

# dev only
urlpatterns += [
  path('dev/parts/create', views_dev.parts_create, name='part_create'),
  path('dev/parts/<int:pk>/edit', views_dev.parts_edit, name='part_edit'),
  path('dev/parts/all', views_dev.parts_list, name='parts_list'),
  path('dev/tasks/create', views_dev.tasks_create, name='tasks_create'),
]


urlpatterns = format_suffix_patterns(urlpatterns)
