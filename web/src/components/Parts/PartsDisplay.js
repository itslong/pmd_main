import React from 'react';

import DisplayComponent from '../DisplayComponent';
import EditPartsForm from './EditPartsForm';
import { FetchAllParts, SearchForItems } from '../endpoints';
import { partsMainDisplayFields } from '../fieldNameAliases';


const PartsDisplay = () => {
  return (
    <DisplayComponent
      initFetch={FetchAllParts}
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
      mainDisplayFields={partsMainDisplayFields}
    >
      <EditPartsForm />
    </DisplayComponent>
  )
};

export default PartsDisplay;
