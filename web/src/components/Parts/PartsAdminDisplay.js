import React from 'react';

import DisplayComponent from '../DisplayComponent';
import EditPartsForm from './EditPartsForm';
import { FetchAllPartsAdmin } from '../endpoints';


const PartsAdminDisplay = () => {
  return (
    <DisplayComponent
      initFetch={FetchAllPartsAdmin}
      initDataKeyToParse={'parts'}
      editType={'modal'}
      displayType={'parts'}
      tableRowType={'buttons'}
      extraPropLayout={'stacked'}
      pageSizeLimits={[10,25,50]}
      initPageSize={10}
      initPageNum={1}
    >
      <EditPartsForm />
    </DisplayComponent>
  );
}

export default PartsAdminDisplay;
