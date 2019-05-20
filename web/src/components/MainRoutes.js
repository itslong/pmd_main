import React from 'react';
import { Route, Switch } from 'react-router-dom';

// import PartsDisplay from './PartsDisplay';
// import PartsAdminDisplay from './PartsAdminDisplay';
// import CreatePartsForm from './CreatePartsForm';
// import PartDetailWithState from './PartDetailWithState';
// import EditPartsForm from './EditPartsForm';
import {
  PartsDisplay,
  PartsAdminDisplay,
  PartDetailWithState,
  CreatePartsForm,
  EditPartsForm 
} from './Parts';
import {
  TasksDisplay,
  TaskDetail,
  CreateTasksForm,
  TaskEdit 
} from './Tasks';
import {
  CategoriesDisplay,
  CreateCategoriesForm,
  CategoryDetail,
  CategoryEdit
} from './Categories';
import {
  JobsDisplay,
  CreateJobsForm,
  JobDetail,
  JobEdit
} from './Jobs';
import { LoginForm, SignupForm } from './Auth';
// import SearchByRoute from './SearchByRoute';
import NotFound from './NotFound';
import {
  HOME_PATH,
  PARTS_DISPLAY_PATH,
  PARTS_DISPLAY_ADMIN_PATH,
  CREATE_PARTS_PATH,
  PART_DETAIL_PATH,
  TASKS_DISPLAY_PATH,
  TASK_DETAIL_PATH,
  TASK_EDIT_PATH,
  CREATE_TASKS_PATH,
  CATEGORIES_DISPLAY_PATH,
  CREATE_CATEGORIES_PATH,
  CATEGORY_DETAIL_PATH,
  CATEGORY_EDIT_PATH,
  JOBS_DISPLAY_PATH,
  CREATE_JOBS_PATH,
  JOB_DETAIL_PATH,
  JOB_EDIT_PATH,
  PART_EDIT_PATH,
  SEARCH_RESULTS_PATH,
  LOGIN_PATH,
  SIGNUP_PATH,
} from './frontendBaseRoutes';

// admin route for display purposes only
const MainRoutes = () => {
  return (
    <main>
      <Switch>
        <Route path={HOME_PATH} />
        <Route exact path={LOGIN_PATH} component={LoginForm} />
        <Route exact path={SIGNUP_PATH} component={SignupForm} />

        <Route path={PARTS_DISPLAY_ADMIN_PATH} component={PartsAdminDisplay} />
        <Route exact path={PARTS_DISPLAY_PATH} component={PartsDisplay} />
        <Route exact path={PART_DETAIL_PATH} component={PartDetailWithState} />
        <Route path={PART_EDIT_PATH} component={EditPartsForm} />

        <Route exact path={TASKS_DISPLAY_PATH} component={TasksDisplay} />
        <Route exact path={TASK_DETAIL_PATH} component={TaskDetail} />
        <Route exact path={TASK_EDIT_PATH} component={TaskEdit} />

        <Route exact path={CATEGORIES_DISPLAY_PATH} component={CategoriesDisplay} />
        <Route exact path={CATEGORY_DETAIL_PATH} component={CategoryDetail} />
        <Route exact path={CATEGORY_EDIT_PATH} component={CategoryEdit} />

        <Route exact path={JOBS_DISPLAY_PATH} component={JobsDisplay} />
        <Route exact path={JOB_DETAIL_PATH} component={JobDetail} />
        <Route exact path={JOB_EDIT_PATH} component={JobEdit} />
        
        <Route exact path={CREATE_PARTS_PATH} component={CreatePartsForm} />
        <Route exact path={CREATE_TASKS_PATH} component={CreateTasksForm} />
        <Route exact path={CREATE_CATEGORIES_PATH} component={CreateCategoriesForm} />
        <Route exact path={CREATE_JOBS_PATH} component={CreateJobsForm} />
        <Route component={NotFound} />
      </Switch>
    </main>
  );
}

export default MainRoutes;
