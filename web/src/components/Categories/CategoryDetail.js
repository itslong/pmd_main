import React, { Component } from 'react';

import DetailView from '../DetailView';
import { FetchCategory } from '../endpoints';
import { categoryDetailRelatedTasksTableFields } from '../fieldNameAliases';

// category tag_type is the same as the parent (Jobs)
const CategoryDetail = (props) => {
  return (
    <DetailView
      initRoute={FetchCategory}
      currentItem={'category'}
      relatedChild={'tasks'}
      relatedParent={'jobs'}
      itemId={props.match.params.id}
      fetchType={'tasks'}
      tableNumLinks={1}
      relatedTableDisplayFields={categoryDetailRelatedTasksTableFields}
    />
  );
}


export default CategoryDetail;
