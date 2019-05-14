from rest_framework import pagination
from rest_framework.response import Response


class PartsCustomResultsSetPagination(pagination.PageNumberPagination):
  page_size = 25
  page_size_query_param = 'page_size'
  max_page_size = 50

  def get_paginated_response(self, data):
    return Response({
      'count': self.page.paginator.count,
      'total_pages': self.page.paginator.num_pages,
      'next': self.get_next_link(),
      'previous': self.get_previous_link(),
      'current_page': self.request.query_params.get('page', None),
      'current_page_size': self.request.query_params.get('page_size', None),
      'parts': data
    })


class TasksCustomResultsSetPagination(pagination.PageNumberPagination):
  page_size = 25
  page_size_query_param = 'page_size'
  max_page_size = 50

  def get_paginated_response(self, data):
    return Response({
      'count': self.page.paginator.count,
      'total_pages': self.page.paginator.num_pages,
      'next': self.get_next_link(),
      'previous': self.get_previous_link(),
      'tasks': data
    })


class CategoriesCustomResultsSetPagination(pagination.PageNumberPagination):
  page_size = 10
  page_size_query_param = 'page_size'
  max_page_size = 50

  def get_paginated_response(self, data):
    return Response({
      'count': self.page.paginator.count,
      'total_pages': self.page.paginator.num_pages,
      'next': self.get_next_link(),
      'previous': self.get_previous_link(),
      'categories': data
    })


class JobsCustomResultsSetPagination(pagination.PageNumberPagination):
  page_size = 5
  page_size_query_param = 'page_size'
  max_page_size = 10

  def get_paginated_response(self, data):
    return Response({
      'count': self.page.paginator.count,
      'total_pages': self.page.paginator.num_pages,
      'next': self.get_next_link(),
      'previous': self.get_previous_link(),
      'current_page': self.page.number,
      'max_page_size': self.max_page_size,
      'jobs': data
    })


class PartsSearchResultsSetPagination(pagination.PageNumberPagination):
  page_size = 10
  page_size_query_param = 'page_size'
  max_page_size = 30

  def get_paginated_response(self, data):
    return Response({
      'count': self.page.paginator.count,
      'total_pages': self.page.paginator.num_pages,
      'next': self.get_next_link(),
      'previous': self.get_previous_link(),
      'current_page': self.page.number,
      'max_page_size': self.max_page_size,
      'parts': data
    })

class TasksSearchResultsSetPagination(pagination.PageNumberPagination):
  page_size = 10
  page_size_query_param = 'page_size'
  max_page_size = 30

  def get_paginated_response(self, data):
    return Response({
      'count': self.page.paginator.count,
      'total_pages': self.page.paginator.num_pages,
      'next': self.get_next_link(),
      'previous': self.get_previous_link(),
      'current_page': self.page.number,
      'max_page_size': self.max_page_size,
      'tasks': data
    })


class CategoriesSearchResultsSetPagination(pagination.PageNumberPagination):
  page_size = 10
  page_size_query_param = 'page_size'
  max_page_size = 40

  def get_paginated_response(self, data):
    return Response({
      'count': self.page.paginator.count,
      'total_pages': self.page.paginator.num_pages,
      'next': self.get_next_link(),
      'previous': self.get_previous_link(),
      'current_page': self.page.number,
      'max_page_size': self.max_page_size,
      'categories': data
    })
