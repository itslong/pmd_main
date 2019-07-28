import React from 'react';

import { Button, Select } from './common';


const partsSortOptions = [
  {name: 'Sort By Part Name: A-Z'},
  {'-name': 'Sort By Part Name: Z-A'},
  {'-base': 'Sort By Base Cost: $ High to $ Low'},
  {base: 'Sort By Base Cost: $ Low to $ High'},
  {'-value': 'Sort By Value Price: $ High to $ Low'},
  {value: 'Sort By Value Price: $ Low to $ High'},
  {'-retail': 'Sort By Retail Price: $ High to $ Low'},
  {retail: 'Sort By Retail Price: $ Low to $ High'},
];

const tasksSortOptions = [
  {name: 'Sort By Task Name: A-Z'},
  {'-name': 'Sort By Task Name: Z-A'},
  {'-task_cost': 'Sort By Task Only Total Cost: $ High to $ Low'},
  {task_cost: 'Sort By Task Only Total Cost: $ Low to $ High'},
  {'-addon_cost': 'Sort By Addon Only Total Cost: $ High to $ Low'},
  {addon_cost: 'Sort By Addon Only Total Cost: $ Low to $ High'},
  {'-task_value': 'Sort By Task Only Value Rate: $ High to $ Low'},
  {task_value: 'Sort By Task Only Value Rate: $ Low to $ High'},
  {'-addon_value': 'Sort By Addon Only Value Rate: $ High to $ Low'},
  {addon_value: 'Sort By Addon Only Value Rate: $ Low to $ High'},
];

const categoriesSortOptions = [
  {name: 'Sort by Category Name: A-Z'},
  {'-name': 'Sort by Category Name: Z-A'},
];

const jobsSortOptions = [
  {name: 'Sort by Job Name: A-Z'},
  {'-name': 'Sort by Job Name: Z-A'},
];

const sortOptionProps = {
  'parts': partsSortOptions,
  'tasks': tasksSortOptions,
  'categories': categoriesSortOptions,
  'jobs': jobsSortOptions,
};


const SortDisplay = ({ displayType, sortByName, updateSortAction, sortOrder }) => {
  const sortOptions = sortOptionProps[displayType];
  let optionValue = '';

  if (sortByName !== '') {
    const sortOrd = sortOrder ? '' : '-';
    const sortName = sortOrd + sortByName;
    const optionIndex = sortOptions.findIndex(opts => {
      return opts[sortName];
    });
    optionValue = sortOptions[optionIndex][sortName];
  }

  return (
    <Select
      placeholder={'Sort by...'}
      value={optionValue}
      options={sortOptions}
      handleChange={updateSortAction}
    />
  );
};


export default SortDisplay;
