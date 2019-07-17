import React from 'react';

import DisplayComponent from '../DisplayComponent';
import { FetchAllJobs, UpdateJobAndRelatedCategories } from '../endpoints';


const JobsDisplay = () => {
    return (
      <DisplayComponent 
        initFetch={FetchAllJobs}
        initDataKeyToParse={'jobs'}
        editType={'route'} 
        displayType={'jobs'}
        tableRowType={'buttons'}
        extraPropsLayout={'stacked'}
        pageSizeLimits={[10]}
        initPageSize={10}
        initPageNum={1}
        tableNumLinks={2}
        deleteRoute={UpdateJobAndRelatedCategories}
      />
    )
};

export default JobsDisplay;
