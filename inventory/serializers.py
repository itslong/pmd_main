from rest_framework import serializers
from inventory.models import Parts, Tasks, Jobs, Categories, PartsMarkup, TagTypesChoices, TasksParts, GlobalMarkup

"""
Parts
PartsList
PartsExcluded

<>Excluded: used for the Main Display with excluded fields.
<>Create: used for POST. Contains excluded fields ('is_active', 'id', etc)
<Main>Related<Child>: (JobsRelatedCategory) used in Detail or Edit Views to display related child data.
<>Searchable: Contains specific fields to use when searching.
<>DetailEdit<>: Combined serializer for both Detail and Edit Views.
TaskPartsAsRelated: specific serializer for the intermediary table: TaskParts.
<>Detail: separation of fields for Detail View.
<>Edit: separation of fields for Edit View.
"""


class TagTypesChoicesSerializer(serializers.ModelSerializer):
  class Meta:
    model = TagTypesChoices
    fields = '__all__'


class JobsExcludedSerializer(serializers.ModelSerializer):
  class Meta:
    model = Jobs
    exclude = ['ordering_num', 'is_active']


class JobsCreateSerializer(serializers.ModelSerializer):
  class Meta:
    model = Jobs
    exclude = ['is_active']


class JobsRelatedCategoriesSerializer(serializers.ModelSerializer):
  class Meta:
    model = Categories
    exclude = ['jobs', 'is_active']


class JobsEditSerializer(serializers.ModelSerializer):
  class Meta:
    model = Jobs
    fields = ['id', 'job_id', 'job_name', 'job_desc', 'ordering_num', 'is_active', 'categories_set']


class JobsDetailSerializer(serializers.ModelSerializer):
  categories = JobsRelatedCategoriesSerializer(source='categories_set', many=True, read_only=True)
  
  class Meta:
    model = Jobs
    fields = '__all__'


class JobsSearchableListSerializer(serializers.ModelSerializer):
  class Meta:
    model = Jobs
    exclude = ['ordering_num', 'is_active']


class PartsAdminSerializer(serializers.ModelSerializer):
  class Meta:
    model = Parts
    fields = '__all__'

  def to_representation(self, instance):
    response = super().to_representation(instance)
    response['tag_types'] = TagTypesChoicesSerializer(instance.tag_types, many=True).data
    return response


class PartsExcludedSerializer(serializers.ModelSerializer):
  class Meta:
    model = Parts
    # fields = '__all__'
    # add custom_retail_part_cost to excluded
    exclude = ['is_active', 'markup_percent_id', 'set_custom_part_cost', 'custom_retail_part_cost']

  def to_representation(self, instance):
    response = super().to_representation(instance)
    response['tag_types'] = TagTypesChoicesSerializer(instance.tag_types, many=True).data
    return response


class PartsSearchableListSerializer(serializers.ModelSerializer):
  part_base_part_cost = serializers.ReadOnlyField(source='base_part_cost')
  part_retail_part_cost = serializers.ReadOnlyField(source='retail_part_cost')

  class Meta:
    model = Parts
    fields = ['id', 'master_part_num', 'part_name', 'tag_types', 'part_base_part_cost','part_retail_part_cost']
  
  def to_representation(self, instance):
    response = super().to_representation(instance)
    response['tag_types'] = TagTypesChoicesSerializer(instance.tag_types, many=True).data
    return response


class PartsCreateSerializer(serializers.ModelSerializer):
  class Meta:
    model = Parts
    # fields = '__all__'
    exclude = ['set_custom_part_cost', 'custom_retail_part_cost']


class PartsDetailEditSerializer(serializers.ModelSerializer):
  class Meta:
    model = Parts
    fields = '__all__'
    # exclude = ['is_active']

  def to_representation(self, instance):
    response = super().to_representation(instance)
    response['tag_types'] = TagTypesChoicesSerializer(instance.tag_types, many=True).data
    return response


class PartsTagTypesEditSerializer(serializers.ModelSerializer):
  class Meta:
    model = Parts.tag_types.through
    fields = '__all__'


class PartsTagTypesSerializer(serializers.ModelSerializer):
  class Meta:
    model = Parts.tag_types.through
    fields = '__all__'


class TasksPartsSerializer(serializers.ModelSerializer):
  class Meta:
    model = TasksParts
    fields = ['id', 'task', 'part', 'quantity']


class TasksPartsAsRelatedSerializer(serializers.ModelSerializer):
  id = serializers.ReadOnlyField(source='part.id')
  master_part_num = serializers.ReadOnlyField(source='part.master_part_num')
  part_name = serializers.ReadOnlyField(source='part.part_name')
  part_base_part_cost = serializers.ReadOnlyField(source='part.base_part_cost')
  part_retail_part_cost = serializers.ReadOnlyField(source='part.retail_part_cost')
  quantity = serializers.ReadOnlyField()
  total_cost = serializers.ReadOnlyField()

  class Meta:
    model = TasksParts
    # fields = '__all__'
    fields = ['id', 'part_name', 'master_part_num', 'part_base_part_cost', 'part_retail_part_cost', 'quantity', 'total_cost']


class TasksPartsFilterByPartSerializer(serializers.ModelSerializer):
  task_name = serializers.ReadOnlyField(source='task.task_name')
  task_desc = serializers.ReadOnlyField(source='task.task_desc')
  task_attribute = serializers.ReadOnlyField(source='task.task_attribute')
  task_id = serializers.ReadOnlyField(source='task.id')
  # required property for api use
  id = serializers.ReadOnlyField(source='task.id')

  class Meta:
    model = TasksParts
    fields = ['id', 'task_id', 'task_name', 'task_desc', 'task_attribute']


class TasksPartsEditSerializer(serializers.ModelSerializer):
  class Meta:
    model = TasksParts
    fields = '__all__'


  def to_representation(self, instance):
    response = super().to_representation(instance)
    response['task'] = TasksExcludedSerializer(instance.task).data
    response['part'] = PartsExcludedSerializer(instance.part).data
    response['markup'] = GlobalMarkupSerializer(instance.markup).data
    return response


class TasksExcludedSerializer(serializers.ModelSerializer):
  related = TasksPartsSerializer(source='tasksparts_set', many=True)

  class Meta:
    model = Tasks
    # fields = ['id', 'task_id', 'task_name', 'tag_types', 'categories', 'task_attribute', 'related', ]
    exclude = ['task_desc', 'task_comments', 'is_active', 'parts']

  def to_representation(self, instance):
    response = super().to_representation(instance)
    response['tag_types'] = TagTypesChoicesSerializer(instance.tag_types).data
    response['categories'] = CategoriesExcludedSerializer(instance.categories).data
    response['related'] = TasksPartsAsRelatedSerializer(instance.tasksparts_set, many=True).data
    return response



class TasksSearchableListSerializer(serializers.ModelSerializer):
  class Meta:
    model = Tasks
    fields = ['id', 'task_id', 'task_name', 'task_attribute']


class TasksCreateSerializer(serializers.ModelSerializer):
  class Meta:
    model = Tasks
    exclude = ['parts', 'categories','is_active']



class TasksDetailEditSerializer(serializers.ModelSerializer):
  # parts_is_active = Parts.objects.exclude(is_active=False)
  # parts = serializers.PrimaryKeyRelatedField(
  #   queryset=parts_is_active,
  #   many=True
  # )
  # parts = serializers.PrimaryKeyRelatedField(
  #   queryset=TasksParts.objects.all(),
  #   many=True
  # )
  # categories_is_active = Categories.objects.exclude(is_active=False)
  categories = serializers.PrimaryKeyRelatedField(read_only=True)
  parts = TasksPartsAsRelatedSerializer(source='tasksparts_set', many=True, read_only=True)

  class Meta:
    model = Tasks
    fields = '__all__'
    # fields = ['parts', 'categories']

  def to_representation(self, instance):
    response = super().to_representation(instance)
    # response['parts'] = PartsSerializer(instance.parts, many=True).data
    # response['parts'] = PartsSearchableListSerializer(instance.parts, many=True).data
    response['categories'] = CategoriesExcludedSerializer(instance.categories).data
    response['tag_types'] = TagTypesChoicesSerializer(instance.tag_types).data
    # response['quantity'] = TasksPartsSerializer(instance., many=True).data
    return response


class CategoriesRelatedTasksSerializer(serializers.ModelSerializer):
  class Meta:
    model = Tasks
    # fields = ['id', 'task_id', 'task_name', 'task_attribute', 'estimated_contractor_hours', 'estimated_contractor_minutes', 'estimated_asst_hours', 'estimated_asst_minutes', 'fixed_labor_rate', 'use_fixed_labor_rate']
    fields = ['id', 'task_id', 'task_name', 'task_attribute']


class CategoriesExcludedSerializer(serializers.ModelSerializer):
  class Meta:
    model = Categories
    fields = ['id', 'category_id', 'category_name', 'category_desc']


class CategoriesCreateSerializer(serializers.ModelSerializer):
  class Meta:
    model = Categories
    exclude = ['jobs', 'is_active']

class CategoriesEditSerializer(serializers.ModelSerializer):
  class Meta:
    model = Categories
    fields = ['id', 'category_id', 'category_name', 'category_desc', 'tasks_set', 'is_active']


class CategoriesDetailSerializer(serializers.ModelSerializer):
  tasks = CategoriesRelatedTasksSerializer(source='tasks_set', many=True, read_only=True)
  # renamed 'jobs' to 'tag_types'
  tag_types = JobsExcludedSerializer(read_only=True, source='jobs')

  class Meta:
    model = Categories
    fields = ['id', 'category_id', 'category_name', 'category_desc','tasks', 'is_active', 'tag_types', 'jobs']

  def to_representation(self, instance):
    response = super().to_representation(instance)
    response['jobs'] = JobsExcludedSerializer(instance.jobs).data
    return response


class CategoriesSearchableListSerializer(serializers.ModelSerializer):
  class Meta:
    model = Categories
    exclude = ['is_active', 'jobs']


class PartsMarkupSerializer(serializers.ModelSerializer):
  class Meta:
    model = PartsMarkup
    fields = '__all__'


class GlobalMarkupSerializer(serializers.ModelSerializer):
  class Meta:
    model = GlobalMarkup
    fields = '__all__'

  def to_representation(self, instance):
    response = super().to_representation(instance)
    response['tag_types'] = TagTypesChoicesSerializer(instance.tag_types).data
    return response
