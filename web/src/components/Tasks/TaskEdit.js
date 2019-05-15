import React from 'react';

import EditByRoute from '../EditByRoute';
import TaskFormFields from './TaskFormFields';
import { FetchTask, UpdateTaskOnly } from '../endpoints';
import { TASKS_DISPLAY_PATH } from '../frontendBaseRoutes';


const TaskEdit = () => {
  return(
    <EditByRoute
      mainPath={TASKS_DISPLAY_PATH}
      mainPathName={'Tasks'}
      fetchRoute={FetchTask}
      updateRoute={UpdateTaskOnly}
      searchTypeForChild={'parts'}
    >
      <TaskFormFields 
        taskAttributeRoute={'task attribute api'}
        tableNumLinks={1}
      />
    </EditByRoute>
  )
}

export default TaskEdit;
