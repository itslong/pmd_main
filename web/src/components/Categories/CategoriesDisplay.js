import React, { Component } from 'react';

import DisplayComponent from '../DisplayComponent';
import { FetchAllCategories, UpdateCategoryAndRelatedTasks } from '../endpoints';


const CategoriesDisplay = () => {
    return (
      <DisplayComponent 
        initFetch={FetchAllCategories}
        initDataKeyToParse={'categories'}
        editType={'route'}
        displayType={'categories'}
        tableRowType={'buttons'}
        extraPropsLayout={'stacked'}
        pageSizeLimits={[10,15,20]}
        initPageSize={10}
        initPageNum={1}
        tableNumLinks={2}
        deleteRoute={UpdateCategoryAndRelatedTasks}
      />
    )
};

export default CategoriesDisplay;
