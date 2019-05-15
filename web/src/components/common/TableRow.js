import React from 'react';
import { Link } from 'react-router-dom';

import { itemPathWithId } from '../frontendBaseRoutes';
import Input from './Input';

// temporary styles. remove later
const stackedTdStyle ={
  // top: '0px',
  // left: '0px',
  display: 'grid'
  // position: 'absolute'
}

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
  // determine if the extraPropsLayout exists
  let extraRowPropsLayout = null;

  if (extraPropsLayout) {
    extraRowPropsLayout = (extraPropsLayout === 'separate') ? 
      extraRowProps.map((obj, index) => {
        return <td key={index}>{obj}</td>
      }) : 
      <td style={stackedTdStyle}>{extraRowProps}</td>;
  }
  // const extraRowPropsLayout = (extraPropsLayout) ? 
  //   extraRowProps.map((obj, index) => {
  //     return <td key={index}>{obj}</td>
  //   }) : 
  //   <td>{extraRowProps}</td>;

  const td = values.map((val, index) => {
    if (index == 0) {
      // skip over the id
      return null;
    }
    
    const valToString = (typeof(val) == 'object') ? convertTagTypesToJoinedString(val) : val.toString();    
    // if (index > 0 && index < 3) {
    if (numberOfLinks > 0 && index <= numberOfLinks) {
      return (
        <td key={index}>
          <Link to={itemPathWithId(itemId, fetchType)}>
            {valToString}
          </Link>
        </td>
      );
    }

    return (
      <td key={index}>{valToString}</td>
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
