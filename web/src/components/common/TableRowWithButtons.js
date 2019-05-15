import React from 'react';
import { Link } from 'react-router-dom';

import Button from './Button';
import { itemPathWithId } from '../frontendBaseRoutes';


const TableRowWithButtons = ({ values, onClickEdit, onClickDelete, fetchType, itemId }) => {
  const td = values.map((val, index) => {
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

    // if (typeof(val) === 'object') {
    //   value = val.map(tag => {
    //     return tag.tag_name
    //   })
    //   .join(', ')
    //   .toString();

    //   return <td key={index}>{value}</td>
    // }

    return (
      <td key={index}>{value}</td>
    );
  })

  return (
    <tr>
      { td }
      <td>
        <Button
          id={itemId}
          type={'primary'}
          action={onClickEdit}
          title={'Edit'}
        />
        <Button
          id={itemId}
          type={'secondary'}
          action={onClickDelete}
          title={'Delete'}
        />
      </td>
    </tr>
  );
}

export default TableRowWithButtons;
