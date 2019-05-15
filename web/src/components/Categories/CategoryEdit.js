import React from 'react';

import EditByRoute from '../EditByRoute';
import CategoryFormFields from './CategoryFormFields';
import { FetchCategory, UpdateCategoryAndRelatedTasks } from '../endpoints';
import { CATEGORIES_DISPLAY_PATH } from '../frontendBaseRoutes';


const CategoryEdit = () => {
  return(
    <EditByRoute
      mainPath={CATEGORIES_DISPLAY_PATH}
      mainPathName={'Categories'}
      fetchRoute={FetchCategory}
      updateRoute={UpdateCategoryAndRelatedTasks}
      searchTypeForChild={'tasks'}
    >
      <CategoryFormFields tableNumLinks={1} />
    </EditByRoute>
  )
  
};

export default CategoryEdit;
