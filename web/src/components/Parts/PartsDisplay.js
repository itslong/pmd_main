import React from 'react';

import DisplayComponent from '../DisplayComponent';
import EditPartsForm from './EditPartsForm';
import { FetchAllParts, SearchForItems, UpdatePart } from '../endpoints';
import { partsMainDisplayFields } from '../fieldNameAliases';


const PartsDisplay = () => {
  return (
    <DisplayComponent
      initFetch={FetchAllParts}
      initDataKeyToParse={'parts'}
      editType={'modal'}
      displayType={'parts'}
      tableRowType={'buttons'}
      extraPropsLayout={'none'}
      pageSizeLimits={[10, 25, 50]}
      initPageSize={10}
      initPageNum={1}
      searchEndpoint={SearchForItems}
      tableNumLinks={2}
      mainDisplayFields={partsMainDisplayFields}
      deleteRoute={UpdatePart}
    >
      <EditPartsForm />
    </DisplayComponent>
  )
};

export default PartsDisplay;
