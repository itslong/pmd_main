from rest_framework import status, generics, permissions, viewsets
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters

from inventory.models import Parts, Tasks, Jobs, Categories, PartsMarkup, TasksParts, TagTypesChoices
from inventory.serializers import *
from inventory.custom_pagination import *


class TagTypesView(generics.ListAPIView):
  queryset = TagTypesChoices.objects.all()
  serializer_class = TagTypesChoicesSerializer
  permission_classes = (permissions.IsAuthenticated, )


class PartsExcludedView(generics.ListAPIView):
  serializer_class = PartsExcludedSerializer
  permission_classes = (permissions.IsAuthenticated, )
  pagination_class = PartsCustomResultsSetPagination

  def get_queryset(self):
    queryset = Parts.objects.exclude(is_active=False)
    filter_param = self.request.query_params.get('filter', None)
    if filter_param is not None:
      queryset = queryset.filter(tag_types__tag_name=filter_param).order_by('id')

    return queryset


# demo purposes only. Remove later
# class PartsAdminView(generics.ListAPIView):
#   queryset = Parts.objects.all()
#   serializer_class = PartsAdminSerializer
#   permission_classes = (permissions.IsAuthenticated, )
#   pagination_class = PartsCustomResultsSetPagination


class PartsCreate(generics.CreateAPIView):
  queryset = Parts.objects.all()
  serializer_class = PartsCreateSerializer
  permission_classes = (permissions.IsAuthenticated, )

  def perform_create(self, serializer):
    serializer.save()


class PartsDetailView(generics.RetrieveAPIView):
  queryset = Parts.objects.all()
  serializer_class = PartsDetailEditSerializer
  permission_classes = (permissions.IsAuthenticated, )


class PartsEdit(generics.RetrieveUpdateAPIView):
  queryset = Parts.objects.all()
  serializer_class = PartsDetailEditSerializer
  permission_classes = (permissions.IsAuthenticated, )


class PartsEditTagTypes(generics.RetrieveUpdateAPIView):
  queryset = Parts.tag_types.through.objects.all()
  serializer_class = PartsTagTypesEditSerializer
  permission_classes = (permissions.IsAuthenticated, )


class PartsTagTypes(generics.ListCreateAPIView):
  queryset = Parts.tag_types.through.objects.all()
  serializer_class = PartsTagTypesSerializer
  permission_classes = (permissions.IsAuthenticated, )


# TODO: remove this later
class PartsEditOrDelete(generics.RetrieveUpdateDestroyAPIView):
  queryset = Parts.objects.all()
  serializer_class = PartsDetailEditSerializer
  permission_classes = (permissions.IsAuthenticated, )


class PartsSearchableList(generics.ListAPIView):
  serializer_class = PartsSearchableListSerializer
  filter_backends = (filters.SearchFilter, )
  search_fields = ('part_name', 'part_desc', 'master_part_num')
  pagination_class = PartsSearchResultsSetPagination
  permission_classes = (permissions.IsAuthenticated, )

  def get_queryset(self):
    queryset = Parts.objects.exclude(is_active=False)
    # FUTURE: check against the value of the 'filter' param to determine which db field to filter
    filter_param = self.request.query_params.get('filter', None)
    if filter_param is not None:
      queryset = queryset.filter(tag_types__tag_name=filter_param).order_by('id')

    return queryset


class TasksExcludedView(generics.ListAPIView):
  serializer_class = TasksExcludedSerializer
  permission_classes = (permissions.IsAuthenticated, )
  pagination_class = TasksCustomResultsSetPagination

  def get_queryset(self):
    queryset = Tasks.objects.exclude(is_active=False)
    filter_param = self.request.query_params.get('filter', None)
    if filter_param is not None:
      queryset = queryset.filter(tag_types__tag_name=filter_param).order_by('id')

    return queryset


class TasksCreate(generics.CreateAPIView):
  queryset = Tasks.objects.all()
  serializer_class = TasksCreateSerializer
  permission_classes = (permissions.IsAuthenticated, )

  def perform_create(self, serializer):
    serializer.save()


class TasksEdit(generics.RetrieveUpdateAPIView):
  queryset = Tasks.objects.all()
  serializer_class = TasksDetailEditSerializer
  permission_classes = (permissions.IsAuthenticated, )


class TasksDetailView(generics.RetrieveAPIView):
  queryset = Tasks.objects.all()
  serializer_class = TasksDetailEditSerializer
  permission_classes = (permissions.IsAuthenticated, )


class TasksSearchableList(generics.ListAPIView):
  serializer_class = TasksSearchableListSerializer
  filter_backends = (filters.SearchFilter, )
  search_fields = ('task_name', 'task_desc', 'task_id')
  pagination_class = TasksSearchResultsSetPagination
  permission_classes = (permissions.IsAuthenticated, )

  def get_queryset(self):
    queryset = Tasks.objects.exclude(is_active=False)
    filter_param = self.request.query_params.get('filter', None)

    if filter_param is not None:
      queryset = queryset.filter(tag_types__tag_name=filter_param).order_by('id')

    return queryset


class TasksPartsEdit(generics.RetrieveUpdateAPIView):
  queryset = TasksParts.objects.all()
  serializer_class = TasksPartsEditSerializer
  permission_classes = (permissions.IsAuthenticated, )


class TasksPartsFilterByPart(generics.ListAPIView):
  serializer_class = TasksPartsFilterByPartSerializer
  filterset_fields = ('part')
  permission_classes = (permissions.IsAuthenticated, )

  def get_queryset(self):
    queryset = TasksParts.objects.all()
    part_id = self.request.query_params.get('part', None)
    if part_id is not None:
      queryset = queryset.filter(part__id=part_id)

    return queryset


class TasksPartsFilterByTask(generics.ListAPIView):
  serializer_class = TasksPartsSerializer
  filterset_fields = ('task')
  permission_classes = (permissions.IsAuthenticated, )

  def get_queryset(self):
    queryset = TasksParts.objects.all()
    task_id = self.request.query_params.get('task', None)
    if task_id is not None:
      queryset = queryset.filter(task__id=task_id)

    return queryset


class TasksPartsViewSet(viewsets.ReadOnlyModelViewSet):
  queryset = TasksParts.objects.all()
  serializer_class = TasksPartsSerializer
  filterset_fields = ('task')
  permission_classes = (permissions.IsAuthenticated, )


  @action(detail=True, methods=['post'])
  def delete_tasks_by_id(self, request, *arg, **kwargs):
    task_id = self.request.query_params.get('task', None)
    if task_id is not None:
      qs = self.get_queryset().filter(task__id=task_id)
      qs.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)



class CategoriesExcludedView(generics.ListAPIView):
  serializer_class = CategoriesExcludedSerializer
  pagination_class = CategoriesCustomResultsSetPagination
  permission_classes = (permissions.IsAuthenticated, )

  def perform_create(self, serializer):
    serializer.save()

  def get_queryset(self):
    queryset = Categories.objects.exclude(is_active=False)

    filter_param = self.request.query_params.get('filter', None)
    if filter_param is not None:
      queryset = queryset.filter(jobs__job_name=filter_param).order_by('id')

    return queryset


class CategoriesCreate(generics.CreateAPIView):
  queryset = Categories.objects.all()
  serializer_class = CategoriesCreateSerializer
  permission_classes = (permissions.IsAuthenticated, )

  def perform_create(self, serializer):
    serializer.save()
    

class CategoriesEdit(generics.RetrieveUpdateAPIView):
  queryset = Categories.objects.all()
  serializer_class = CategoriesEditSerializer
  permission_classes = (permissions.IsAuthenticated, )


class CategoriesDetailView(generics.RetrieveAPIView):
  queryset = Categories.objects.all()
  serializer_class = CategoriesDetailSerializer
  permission_classes = (permissions.IsAuthenticated, )


class CategoriesSearchableList(generics.ListAPIView):
  serializer_class = CategoriesSearchableListSerializer
  filter_backends = (filters.SearchFilter, )
  search_fields = ('category_name', 'category_desc', 'category_id')
  pagination_class = CategoriesSearchResultsSetPagination
  permission_classes = (permissions.IsAuthenticated, )

  def get_queryset(self):
    queryset = Categories.objects.exclude(is_active=False)

    filter_param = self.request.query_params.get('filter', None)
    if filter_param is not None:
      queryset = queryset.filter(jobs__job_name=filter_param).order_by('id')

    return queryset


class JobsExcludedView(generics.ListAPIView):
  queryset = Jobs.objects.exclude(is_active=False)
  serializer_class = JobsExcludedSerializer
  pagination_class = JobsCustomResultsSetPagination
  permission_classes = (permissions.IsAuthenticated, )


class JobsCreate(generics.CreateAPIView):
  queryset = Jobs.objects.all()
  serializer_class = JobsCreateSerializer
  permission_classes = (permissions.IsAuthenticated, )

  def perform_create(self, serializer):
    serializer.save()


class JobsDetailView(generics.RetrieveAPIView):
  queryset = Jobs.objects.all()
  serializer_class = JobsDetailSerializer
  permission_classes = (permissions.IsAuthenticated, )

class JobsEdit(generics.RetrieveUpdateAPIView):
  queryset = Jobs.objects.all()
  serializer_class = JobsEditSerializer
  permission_classes = (permissions.IsAuthenticated, )

class JobsSearchableList(generics.ListAPIView):
  queryset = Jobs.objects.all()
  serializer_class = JobsSearchableListSerializer
  pagination_class = JobsCustomResultsSetPagination
  filter_backends = (filters.SearchFilter, )
  search_fields = ('job_name', 'job_desc')
  permission_classes = (permissions.IsAuthenticated, )


class PartsMarkupList(generics.ListAPIView):
  queryset = PartsMarkup.objects.all()
  serializer_class = PartsMarkupSerializer
  permission_classes = (permissions.IsAuthenticated, )


class PartsMarkupCreate(generics.CreateAPIView):
  queryset = PartsMarkup.objects.all()
  serializer_class = PartsMarkupSerializer
  permission_classes = (permissions.IsAuthenticated, )

  def perform_create(self, serializer):
    serializer.save()

class PartsMarkupEdit(generics.RetrieveUpdateAPIView):
  queryset = PartsMarkup.objects.all()
  serializer_class = PartsMarkupSerializer
  permission_classes = (permissions.IsAuthenticated, )


class TasksPartsList(generics.ListCreateAPIView):
  queryset = TasksParts.objects.all()
  serializer_class = TasksPartsSerializer
  permission_classes = (permissions.IsAuthenticated, )


class GlobalMarkupView(generics.ListCreateAPIView):
  queryset = GlobalMarkup.objects.all()
  serializer_class = GlobalMarkupSerializer
  permission_classes = (permissions.IsAuthenticated, )
