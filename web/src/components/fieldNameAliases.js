const handlePluralNames = {
  parts: 'part',
  tasks: 'task',
  categories: 'category',
  jobs: 'job'
};

const partsMainDisplayFields = {
  id: 'id',
  master_part_num: 'Part ID',
  part_name: 'Part Name',
  tag_types: 'Tag Types',
  base_part_cost: 'Base Cost',
  retail_part_cost: 'Value Price',
};

const partDetailFormFields = {
  id: 'ID',
  master_part_num: 'Part ID',
  part_name: 'Part Name',
  upc_num: 'UPC Number',
  mfg_part_num: 'Manufacturing Number',
  part_desc: 'Description',
  base_part_cost: 'Part Cost',
  retail_part_cost: 'Retail Price',
  markup_percent_id: 'Markup Percent ID',
  set_custom_part_cost: 'Set Custom Part Cost?',
  custom_retail_part_cost: 'Custom Retail Price',
  is_active: 'Part Active',
};

const partDetailRelatedTasksTableFields = {
  id: 'id',
  task_id: 'Task ID',
  task_name: 'Task Name',
  task_desc: 'Description',
  task_attribute: 'Task Attributes'
};

const partsSearchResultsTableFields = {
  id: 'id',
  part_name: 'Part Name',
  master_part_num: 'Part ID',
  tag_types: 'Tags',
  part_base_part_cost: 'Part Cost',
  part_retail_part_cost: 'Retail Price'
};


const taskMainDispayCalculationFields = [
  'estimated_contractor_hours',
  'estimated_contractor_minutes',
  'estimated_asst_hours',
  'estimated_asst_minutes',
  'fixed_labor_rate',
  'use_fixed_labor_rate',
  'related',
];

const taskMainDisplayFields = {
  id: 'id',
  task_id: 'Task ID',
  task_name: 'Task Name',
  tag_types: 'Tag Types',
  categories: 'Categories',
  task_attribute: 'Task Attributes'
};

const taskDetailRelatedPartsTableFields = {
  id: 'id',
  part_name: 'Part Name',
  master_part_num: 'Part ID',
  part_base_part_cost: 'Part Cost',
  part_retail_part_cost: 'Retail Price',
  quantity: 'Quantity',
  total_cost: 'Total Cost',
};

const taskSearchResultsTableFields = {
  id: 'id',
  task_id: 'Task ID',
  task_name: 'Task Name',
  task_attribute: 'Task Type',
  categories: 'Category',
};

const taskDetailFormFields = {

};


const categoriesMainDisplayFields = {
  id: 'id',
  category_id: 'Category ID',
  category_name: 'Category Name'
};

const categoryDetailRelatedTasksTableFields = {
  id: 'id',
  task_id: 'Task ID',
  task_name: 'Task Name',
  task_attribute: 'Task Type'
};

const categorySearchResultsTableFields = {
  id: 'id',
  category_id: 'Category ID',
  category_name: 'Category Name',
  jobs: 'Job',
};

const categoryDetailFormFields = {

};


const jobsMainDisplayFields = {
  id: 'id',
  job_id: 'Job ID',
  job_name: 'Job Name'
};

const jobRelatedCategoriesTableFields = {
  id: 'id',
  category_id: 'Category ID',
  category_name: 'Category Name'
};

const jobDetailFormFields = {

};

// doubling properties to handle pluralized keys
const staticDetailTableFields = {
  part: {
    form: partDetailFormFields,
    search: partsSearchResultsTableFields,
    parent: partDetailRelatedTasksTableFields
  },
  task: {
    form: '',
    search: taskSearchResultsTableFields,
    child: taskDetailRelatedPartsTableFields,
  },
  category: {
    form: '',
    child: categoryDetailRelatedTasksTableFields,
    search: categorySearchResultsTableFields,
  },
  job: {
    form: '',
    child: jobRelatedCategoriesTableFields,
  },
};

const staticMainDisplayTableFields = {
  categories: categoriesMainDisplayFields,
  jobs: jobsMainDisplayFields
};

/*
resultsArr: array of objects
targetType: string. 'parts', 'tasks', 'category/categories'
viewType: string. 'display', 'detail'
*/
const renameStaticTableFields = (resultsArr, targetType, viewType) => {
  const tableFields = viewType == 'display' ? 
    staticMainDisplayTableFields[targetType]
    : staticDetailTableFields[targetType][viewType];

  let renamedResults = resultsArr.map(item => {
    let renamedObj = {};

    const displayNames = Object.values(tableFields);
    const itemKeys = Object.keys(tableFields);

    itemKeys.map(key => {
      Object.assign(renamedObj, {
        [tableFields[key]]: item[key]
      });
    });

    return renamedObj;
  });

  return renamedResults;
};

/*
dataObj: object. DetailView and DetailTable contains data in object.
targetType: string. 'parts', 'tasks', 'category/categories'
viewType: string. 'form, search, child/parent'
*/
const renameStaticObjTableFields = (dataObj, targetType, viewType) => {
  const itemKeys = Object.keys(dataObj);
  const tableFields = staticDetailTableFields[targetType][viewType];

  let renamedObj = {};

  itemKeys.map(item => {
    Object.assign(renamedObj, {
      [tableFields[item]]: dataObj[item]
    });
  });

  return renamedObj;
}

export {
  partsMainDisplayFields,
  partDetailRelatedTasksTableFields,
  taskMainDisplayFields,
  taskMainDispayCalculationFields,
  taskDetailRelatedPartsTableFields,
  renameStaticTableFields,
  categoryDetailRelatedTasksTableFields,
  renameStaticObjTableFields,
  handlePluralNames
}
