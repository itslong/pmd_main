import React from 'react';
import { Link } from 'react-router-dom';

import { itemPathWithId } from '../frontendBaseRoutes';
import Input from './Input';
import { tblTdStyle } from './styles';


const convertTagTypesToJoinedString = (arrObj) => {
  const value = arrObj.length ? arrObj.map(({ tag_name }) => {
    return tag_name;
  }).join(', ').toString()
  : arrObj.tag_name || arrObj.category_name || arrObj.job_name;

  return value;
};


const TableRow = ({ 
  values, 
  fetchType, 
  itemId, 
  extraRowProps, 
  extraPropsLayout, 
  rowData, 
  numberOfLinks 
}) => {
  // determine if the extraPropsLayout exists. default to no td styling.
  let extraRowPropsLayout = null;

  if (extraPropsLayout) {
    extraRowPropsLayout = (extraPropsLayout === 'separate') ? 
      extraRowProps.map((obj, index) => {
        return <td key={index} style={tblTdStyle}>{obj}</td>
      })
    : (extraPropsLayout === 'stacked') ?
      <td className={'stacked'}>{extraRowProps}</td>
    : <td style={tblTdStyle} className={'normal'}>{extraRowProps}</td>;
  }

  const td = values.map((val, index) => {
    if (index == 0) {
      // skip over the id
      return null;
    }
    
    const valToString = (typeof(val) == 'object') ? convertTagTypesToJoinedString(val) : val.toString();    
    // if (index > 0 && index < 3) {
    if (numberOfLinks > 0 && index <= numberOfLinks) {
      return (
        <td key={index} style={tblTdStyle}>
          <Link to={itemPathWithId(itemId, fetchType)}>
            {valToString}
          </Link>
        </td>
      );
    }

    return (
      <td key={index} style={tblTdStyle}>{valToString}</td>
    );
  })

  return (
    <tr>
      {td}
      {extraRowPropsLayout}
    </tr>
  )
};

export default TableRow;
