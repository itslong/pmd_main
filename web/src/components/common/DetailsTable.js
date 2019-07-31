import React from 'react';
import Table from './Table';

const tableStyles = {
  width: '50%',
  // borderColor: 'green',
  // borderStyle: 'solid'
};
// shape of data is a single object
const DetailsTable = ({ data, tagTypes=null, relatedChild, relatedParent, fetchType, numberOfLinks }) => {
  // parts: array; non-parts: default to null. tagTypes have been merged with data
  const tagTypesAsString = (tagTypes !== null && tagTypes.length) ? 
    tagTypes.map(({ tag_name }) => tag_name).join(', ').toString() 
    : null;

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

  // non-part tagType renaming has been merged into data.
  const displayTagtypes = tagTypes !== null ?
    <tr>
      <td>Tags</td>
      <td>{tagTypesAsString}</td>
    </tr>
    : null;

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
        {displayTagtypes}
        {relatedParentRow}
      </tbody>
    </table>
    {relatedChildTable}
    </div>
  );
};

export default DetailsTable;
