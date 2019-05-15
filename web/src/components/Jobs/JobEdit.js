import React from 'react';

import EditByRoute from '../EditByRoute';
import JobFormFields from './JobFormFields';
import { FetchJob, UpdateJobAndRelatedCategories } from '../endpoints';
import { JOBS_DISPLAY_PATH } from '../frontendBaseRoutes';


const JobEdit= () => {
  return (
    <EditByRoute
      mainPath={JOBS_DISPLAY_PATH}
      mainPathName={'Jobs'}
      fetchRoute={FetchJob}
      updateRoute={UpdateJobAndRelatedCategories}
      searchTypeForChild={'categories'}
    >
      <JobFormFields tableNumLinks={1} />
    </EditByRoute>
  )
};

export default JobEdit;
