
const PATH = '/web';
const BASE_PATH = PATH;

const HOME_PATH = PATH + '/home';

const PARTS_DISPLAY_PATH = PATH + '/parts';
const PARTS_DISPLAY_ADMIN_PATH = PATH + '/admin' + '/parts';
const CREATE_PARTS_PATH = PATH + '/create-part';
const PART_DETAIL_PATH = PATH + '/part/:id';
const PART_EDIT_PATH = PATH + '/part/edit/:id';

const TASKS_DISPLAY_PATH = PATH + '/tasks';
const CREATE_TASKS_PATH = PATH + '/create-task';
const TASK_DETAIL_PATH = PATH + '/task/:id';
const TASK_EDIT_PATH = PATH + '/task/edit/:id';

const CATEGORIES_DISPLAY_PATH = PATH + '/categories';
const CREATE_CATEGORIES_PATH = PATH + '/create-category';
const CATEGORY_DETAIL_PATH = PATH + '/category/:id';
const CATEGORY_EDIT_PATH = PATH + '/category/edit/:id';

const JOBS_DISPLAY_PATH = PATH + '/jobs';
const CREATE_JOBS_PATH = PATH + '/create-job';
const JOB_DETAIL_PATH = PATH + '/job/:id';
const JOB_EDIT_PATH = PATH + '/job/edit/:id';

const SEARCH_RESULTS_PATH = PATH + '/search-results';

const LOGIN_PATH = PATH + '/login';
const SIGNUP_PATH = PATH + '/register';

const itemPaths = {
  parts: PATH + '/part',
  part: PATH + '/part',
  tasks: PATH + '/task',
  task: PATH + '/task',
  categories: PATH + '/category',
  category: PATH + '/category',
  jobs: PATH + '/job',
  job: PATH + '/job',
}

const itemPathWithId = (id, pathType) => {
  return itemPaths[pathType] + '/' + id;
}

const editPathWithId = (id, pathType) => {
  return itemPaths[pathType] + '/edit/' + id;
}

export {
  BASE_PATH,
  HOME_PATH,
  PARTS_DISPLAY_PATH,
  PARTS_DISPLAY_ADMIN_PATH,
  CREATE_PARTS_PATH,
  PART_DETAIL_PATH,
  PART_EDIT_PATH,
  TASKS_DISPLAY_PATH,
  CREATE_TASKS_PATH,
  TASK_DETAIL_PATH,
  TASK_EDIT_PATH,
  CATEGORIES_DISPLAY_PATH,
  CREATE_CATEGORIES_PATH,
  CATEGORY_DETAIL_PATH,
  CATEGORY_EDIT_PATH,
  JOBS_DISPLAY_PATH,
  CREATE_JOBS_PATH,
  JOB_DETAIL_PATH,
  JOB_EDIT_PATH,
  SEARCH_RESULTS_PATH,
  LOGIN_PATH,
  SIGNUP_PATH,
  itemPathWithId,
  editPathWithId
};
