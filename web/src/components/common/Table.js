import React, { Children, cloneElement } from "react";
import { Link } from 'react-router-dom';

import { itemPathWithId } from '../frontendBaseRoutes';
import TableRowWithCheckbox from './TableRowWithCheckbox';
import TableRowWithButtons from './TableRowWithButtons';
import TableRow from './TableRow';
import { GTable, columnThStyle } from './styles';


/**
  data: array of objects.
  fetchType: 'parts', 'tasks'; used for modifying the path to an item's detail view.
  onClickEdit: for rows with buttons // remove this as handlers are passed in from parent
  onClickDelete: for rows with buttons // remove this as handlers are passed in from parent
  headerText: customize table header's text.
  rowType: 'buttons', 'checkbox'. If not set, defaults to nothing. // remove
  handleCheckbox: for rows with checkboxes,
  extraColHeaders: array of strings to create more column headers
  extraRowProps: array of components (objects)
  extraPropsLayout: string: 'stacked' (elements are stacked in one column)
                            'separate' (elements are separate in their own columns)
  numberOfLinks: integer. Determins the number of items that should be <ii> from left to right. Farthest left item is 1 (since 0 is dropped)
**/
const Table = ({ 
  tableId,
  data, 
  fetchType, 
  headerText, 
  handleCheckbox, 
  extraColHeaders, 
  extraRowProps,
  extraPropsLayout,
  rowData,
  numberOfLinks
}) => {
  const numLinks = numberOfLinks ? numberOfLinks : 0;
  let tableRow = <TableRow 
    fetchType={fetchType} 
    extraPropsLayout={extraPropsLayout} 
    numberOfLinks={numLinks}
  />;

  return (
    !data.length ? <p>No data is available.</p> :
    <div className="column">
      <h3 className="subtitle">
        { headerText }
      </h3>

      <GTable id={tableId} className="table is-striped">
        <thead>
          <tr>
            {Object.entries(data[0]).map((headers, key) => {
              if (key == 0) {
                // skip over the id
                return null;
              }
              return <th key={key} style={columnThStyle}>{headers[0]}</th>
            })}
            {extraColHeaders ? extraColHeaders.map((value, index) => {
              return <th key={index} style={columnThStyle}>{value}</th>
            }) : null}
          </tr>
        </thead>
        <tbody>
          {data.map((items, index) => {
            // in display, id=pk; in edit view, uses part_id or task_id
            let itemId = items.id || items.part_id || items.task_id;
            // for each button passed down, add the item's id
            const cleanRowProps = (extraRowProps) ? extraRowProps.map(obj => {
              return (
                cloneElement(obj, {
                  id: itemId,
                  name: itemId,
                })
              )}
            ) : '';

            const rowValues = Object.values(items);
            const tableRowWithProps = cloneElement(tableRow, {
              itemId: itemId,
              key: index,
              values: rowValues,
              extraRowProps: cleanRowProps,
              rowData: items,
            });

            return (
              {...tableRowWithProps}
            )
          })}
        </tbody>
      </GTable>
    </div>

  )
}

export default Table;
