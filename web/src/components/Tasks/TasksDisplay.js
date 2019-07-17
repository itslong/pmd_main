import React from 'react';

import { FetchAllTasks, UpdateTaskOnly } from '../endpoints';
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
      extraPropsLayout={'none'}
      pageSizeLimits={[10,40,50]}
      initPageSize={10}
      initPageNum={1}
      tableNumLinks={2}
      calculationFields={taskMainDispayCalculationFields}
      mainDisplayFields={taskMainDisplayFields}
      deleteRoute={UpdateTaskOnly}
    />
  )

}

export default TasksDisplay;
