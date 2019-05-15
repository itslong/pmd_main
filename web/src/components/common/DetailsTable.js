import React from 'react';
import Table from './Table';

const tableStyles = {
  width: '50%',
  // borderColor: 'green',
  // borderStyle: 'solid'
};
// shape of data is a single object
const DetailsTable = ({ data, tagTypes, relatedChild, relatedParent, fetchType, numberOfLinks }) => {
  // parts: array; tasks or categories: string. category uses jobs for tag types
  const tagTypesAsString = (tagTypes.length) ? 
    tagTypes.map(({ tag_name }) => tag_name).join(', ').toString() 
    : tagTypes.tag_name || tagTypes.job_name || '';

  const relatedParentRow = relatedParent ? 
    <tr><td>category</td><td>{relatedParent}</td></tr> 
    : null;

  const relatedChildTable = relatedChild ?
    <Table
      tableId={'related-items-table'}
      data={relatedChild}
      fetchType={fetchType}
      numberOfLinks={numberOfLinks}
    /> : '';


  return (
    <div>
    <table id='form-table' style={tableStyles}>
      <thead>
        <tr>
          <th>Details Table</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(data).map((val, key) => {
          return (
            <tr key={key}>
              <td>{val[0]}</td>
              <td>{val[1].toString()}</td>
            </tr>
          )
        })}
        <tr>
          <td>tag_types</td>
          <td>{tagTypesAsString}</td>
        </tr>
        {relatedParentRow}
      </tbody>
    </table>
    {relatedChildTable}
    </div>
  );
};

export default DetailsTable;
