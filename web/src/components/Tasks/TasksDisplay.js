import React from 'react';

import { FetchAllTasks } from '../endpoints';
import DisplayComponent from '../DisplayComponent';
import { taskMainDisplayFields, taskMainDispayCalculationFields } from '../fieldNameAliases';


const TasksDisplay = () => {
  return (
    <DisplayComponent
      initFetch={FetchAllTasks}
      initDataKeyToParse={'tasks'}
      editType={'route'}
      displayType={'tasks'}
      tableRowType={'buttons'}
      extraPropsLayout={'stacked'}
      pageSizeLimits={[15,40,50]}
      initPageSize={10}
      initPageNum={1}
      tableNumLinks={2}
      calculationFields={taskMainDispayCalculationFields}
      mainDisplayFields={taskMainDisplayFields}
    />
  )

}

export default TasksDisplay;
