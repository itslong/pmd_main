from django.db import models
from localflavor.us.us_states import US_STATES


# these choices are used throughout the models.
DRAIN_CLEANING = 'Drain Cleaning'
PLUMBING = 'Plumbing'
WATER_HEATER = 'Water Heater'
MISC = 'Misc'

TAG_CHOICES = (
  (DRAIN_CLEANING, 'Drain Cleaning'),
  (PLUMBING, 'Plumbing'),
  (WATER_HEATER, 'Water Heater'),
  (MISC, 'Misc'),
)

class TagTypesChoices(models.Model):
  tag_name = models.CharField(max_length=25, choices=TAG_CHOICES)

  def __str__(self):
    return self.tag_name


class Jobs(models.Model):
  # J1, J2, J30, J-302
  job_id = models.CharField(max_length=10, blank=True)
  # job_name is striclty limited to a single choice. 
  job_name = models.CharField(max_length=25, choices=TAG_CHOICES)
  job_desc = models.CharField(max_length=255, blank=True)
  # the ordering of the tasks matter. Set to CharField for now
  ordering_num = models.CharField(max_length=255, blank=True)
  is_active = models.BooleanField(default=True)

  class Meta:
    ordering = ('job_id', )

  def __str__(self):
    return ('id: %d, job_name: %s') % (self.id, self.job_name)


class Categories(models.Model):
  # CXXXX?
  category_id = models.CharField(max_length=10, blank=True)
  category_name = models.CharField(max_length=255)
  category_desc = models.CharField(max_length=255, blank=True)

  # tag_types is redundant with job's id
  jobs = models.ForeignKey(Jobs, on_delete=models.SET_NULL, blank=True, null=True)
  is_active = models.BooleanField(default=True)

  class Meta:
    ordering = ('category_name', )

  def __str__(self):
    return ('id: %d, category_name: %s') % (self.id, self.category_name)


class Parts(models.Model):
  part_name = models.CharField(max_length=255)
  master_part_num = models.CharField(max_length=10, blank=True)
  mfg_part_num = models.CharField(max_length=10, blank=True)
  upc_num = models.CharField(max_length=10, blank=True)
  part_desc = models.CharField(max_length=255, blank=True)
  tag_types = models.ManyToManyField(TagTypesChoices)

  base_part_cost = models.DecimalField(help_text="Empty input defaults to 0.00.", max_digits=10, decimal_places=2, default=0.00)
  markup_percent_id = models.CharField(max_length=100, blank=True)
  set_custom_part_cost = models.BooleanField(default=False)
  custom_retail_part_cost = models.DecimalField(help_text="Empty input defaults to 0.", max_digits=10, decimal_places=2, default=0.00)
  retail_part_cost = models.DecimalField(help_text="Empty input defaults to 0.00.", max_digits=10, decimal_places=2, default=0.00)
  is_active = models.BooleanField(default=True)

  class Meta:
    ordering = ('master_part_num', )

  def __str__(self):
    return ('id: %d,  part_name: %s') % (self.id, self.part_name)


class Tasks(models.Model):
  ADDON_ONLY = 'Addon Only'
  TASK_ONLY = 'Task Only'
  ADDON_AND_TASK = 'Addon and Task' 

  TASK_TYPE_CHOICES = (
    (TASK_ONLY, 'Task Only'),
    (ADDON_ONLY, 'Addon Only'),
    (ADDON_AND_TASK, 'Addon and Task'),
  )

  task_id = models.CharField(max_length=10)
  task_name = models.CharField(max_length=255, blank=True)
  task_desc = models.CharField(max_length=255, blank=True)
  task_comments = models.CharField(max_length=255, blank=True)
  task_attribute = models.CharField(max_length=15, choices=TASK_TYPE_CHOICES, default=TASK_ONLY)
  tag_types = models.ForeignKey(TagTypesChoices, on_delete=models.SET_NULL, null=True)

  estimated_contractor_hours = models.FloatField(help_text="2.0 represents 2 hours. \n Empty input defaults to 0.0 in db. ", default=0.0) #task only
  estimated_contractor_minutes = models.FloatField(help_text="2.5 represets 2 minutes 30 seconds. \n Empty input defaults to 0.0 in db.", default=0.0) #addon only
  estimated_asst_hours = models.FloatField(help_text="2.0 represents 2 hours. \n Empty input defaults to 0.0 in db.", default=0.0) #addon only
  estimated_asst_minutes = models.FloatField(help_text="2.5 represets 2 minutes 30 seconds. \n Empty input defaults to 0.0 in db.", default=0.0)

  fixed_labor_rate = models.DecimalField(help_text="Empty input defaults to 0.00.", max_digits=10, decimal_places=2, default=0.00)
  use_fixed_labor_rate = models.BooleanField(default=False)
  is_active = models.BooleanField(default=True)

  parts = models.ManyToManyField(Parts, through="TasksParts")
  categories = models.ForeignKey(Categories, on_delete=models.SET_NULL, blank=True, null=True)


  class Meta:
    ordering = ('task_id', )

  def __str__(self):
    return ('id: %i, task_name: %s') % (self.id, self.task_name)


class PartsMarkup(models.Model):
  range_low = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
  range_high = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
  markup_percent = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)

  def __str__(self):
    return ('id: %i, low: %.2f, high: %.2f, markup_percent: %.2f') % (self.id, self.range_low, self.range_high, self.markup_percent)


class GlobalMarkup(models.Model):
  tag_types = models.ForeignKey(TagTypesChoices, on_delete=models.SET_NULL, null=True)
  labor_cost_hourly_rate = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
  labor_retail_hourly_rate = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
  asst_labor_cost_hourly_rate = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
  asst_labor_retail_hourly_rate = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
  misc_tos_cost_hourly_rate = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
  misc_tos_retail_hourly_rate = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
  standard_labor_markup_percent = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
  standard_material_markup_percent = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
  standard_total_markup_percent = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
  labor_tax_percent = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
  parts_tax_percent = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
  invoice_tax_percent = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)

  def __str__(self):
    return self.tag_types.tag_name


class TasksParts(models.Model):
  task = models.ForeignKey(Tasks, on_delete=models.SET_NULL, blank=True, null=True)
  part = models.ForeignKey(Parts, on_delete=models.SET_NULL, blank=True, null=True)
  quantity = models.IntegerField()

  @property
  def total_cost(self):
    return '%.2f' % (self.part.base_part_cost * self.quantity, )

  class Meta:
    unique_together = ['task', 'part']

  def __str__(self):
    return self.part.part_name + ' ' + self.task.task_name + ': ' + str(self.quantity)

