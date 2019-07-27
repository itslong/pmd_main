import React from 'react';

const sortItems = (itemType, property, sortOrder, dataArr) => {

  const propName = fieldNameProperties[itemType][property];
  const propertyType = fieldNameComparisonTypes[itemType][property];

  const sorted = propertyType == 'str' ?
    [...dataArr].sort(compareStrings(propName, sortOrder))
    : [...dataArr].sort(compareNumbers(propName, sortOrder))

  return sorted;
}

const compareNumbers = (property, sortAsc) => {
  const sortOrder = sortAsc ? 1 : -1;

  return (a, b) => {
    const propA = Number(a[property]);
    const propB = Number(b[property]);
    let result = a[property] - b[property];

   // push NaN or 'N/A' to the end
    if (!isFinite(result)) {
      result = isFinite(propA) ? -1 : 1;
    }

    return result * sortOrder;
  }
}

const compareStrings = (property, sortAsc) => {
  const sortOrder = sortAsc ? 1 : -1;
  
  return (a, b) => {
    const propA = a[property].toUpperCase();
    const propB = b[property].toUpperCase();
    const result = (propA < propB) ? -1 : (propA > propB) ? 1 : 0;
    return result * sortOrder;
  }
}

const fieldNameProperties = {
  'parts': {
    'name': 'Part Name',
    'base': 'Base Cost',
    'value': 'Value Price',
    'retail': 'Retail Price',
  },
  'tasks': {
    'name': 'Task Name',
    'task_cost': 'Task Only Total Cost',
    'task_value': 'Task Only Value Rate',
    'addon_cost': 'Addon Only Total Cost',
    'addon_value': 'Addon Only Value Rate',
  },
  'categories': {
    'name': 'Category Name',
  },
  'jobs': {
    'name': 'Job Name',
  },
};

const fieldNameComparisonTypes = {
  'parts': {
    'name': 'str',
    'base': 'int',
    'value': 'int',
    'retail': 'int',
  },
  'tasks': {
    'name': 'str',
    'task_cost': 'int',
    'task_value': 'int',
    'addon_cost': 'int',
    'addon_value': 'int',
  },
  'categories': {
    'name': 'str',
  },
  'jobs': {
    'name': 'str',
  },
};

export default sortItems;
