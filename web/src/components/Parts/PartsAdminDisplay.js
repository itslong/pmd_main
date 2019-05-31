import React from 'react';

import DisplayComponent from '../DisplayComponent';
import EditPartsForm from './EditPartsForm';
import { FetchAllPartsAdmin, SearchForItems } from '../endpoints';
import { partsMainDisplayFields } from '../fieldNameAliases';


const PartsAdminDisplay = () => {
  return (
    <DisplayComponent
      initFetch={FetchAllPartsAdmin}
      initDataKeyToParse={'parts'}
      editType={'modal'}
      displayType={'parts'}
      tableRowType={'buttons'}
      extraPropsLayout={'stacked'}
      pageSizeLimits={[10, 25, 50]}
      initPageSize={10}
      initPageNum={1}
      searchEndpoint={SearchForItems}
      tableNumLinks={2}
      adminDisplayFields={'admin'}
    >
      <EditPartsForm />
    </DisplayComponent>
  );
}

export default PartsAdminDisplay;
