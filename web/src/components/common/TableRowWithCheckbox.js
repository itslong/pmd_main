import React from 'react';
import { Link } from 'react-router-dom';

import Checkbox from './Checkbox';
import { itemPathWithId } from '../frontendBaseRoutes';


const TableRowWithCheckbox = ({ values, fetchType, itemId, handleCheckbox }) => {
  const tdLink = values.map((val, index) => {
    let value = val.toString();

    if (index <= 1) {
      return (
        <td key={index}>
          <Link to={itemPathWithId(itemId, fetchType)}>
            {value}
          </Link>
        </td>
      );
    }


    if (typeof val[0] === 'object') {
      // tag types is an array of objects
      value = val.map(({ id, ...obj }) => {
        return (Object.entries(obj).map(va => {
          return va[1]
        }))
      }).join(', ').toString();

      return <td key={index}>{value}</td>
    }

    return (
      <td key={index}>{value}</td>
    )
  })


  return (
    <tr>
      { tdLink }
      <td>
        <Checkbox 
          onChange={handleCheckbox}
        />
      </td>
    </tr>
  )
};

export default TableRowWithCheckbox;
