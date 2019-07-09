import React from 'react';
import styled from 'styled-components';

/*
  Prefixes determines the type of component styling.
  G: Global style
*/
const GButton = styled.button`
  background: ${props => buttonBackgroundColor[props.className]};
  color: ${props => buttonFontColor[props.className]};
  cursor:pointer;
  border-radius: 4px;
  font-size: 12px;
  border: 1px solid #cbcbcb;
  width: ${props => buttonWidth[props.className]};
  padding-left: 10px;
  padding-right: 10px;
`;

// retain style flexibility for buttons
const buttonBackgroundColor = {
  submitBtn: '#9A0008',
  closeBtn: '#4f554a',
  primary: '#9A0008',
  tblEditBtn: '#9A0008',
};

const buttonFontColor = {
  primary: '#fff',
  submitBtn: '#fff',
  tblEditBtn: '#fff',
  closeBtn: '#fff',
};

const buttonWidth = {
  tblEditBtn: '100%',
  tblDeleteBtn: '100%',
};

const disabledButtonStyle = {
  cursor: 'not-allowed',
  pointerEvents: 'none',
  color: '#c0c0c0',
  backgroundColor: '#ffffff'
};

const activeButtonStyle = {
  backgroundColor: '#9A0008',
  color: 'white',
  cursor: 'pointer'
};

/*
  Table styling.
  Stacked: buttons are to be stacked on top of each other. For Categories and Job Tables.
  Normal: Parts and Tasks tables contain many columns so 
*/
const GTable = styled.table`
  table-layout: fixed;
  width: 100%;
  word-wrap: break-word;
  border: 1px solid #bcc0b7;
`;


const tblTdStyle = {
  textAlign: 'center',
  verticalAlign: 'middle',
  border: '1px solid #bcc0b7',
};

const columnThStyle = {
  width: 'auto',
  textAlign: 'center',
  color: '#9A0008',
  verticalAlign: 'middle',
  fontSize: '14px',
  border: '1px solid #bcc0b7',
}

export {
  GButton,
  GTable,
  disabledButtonStyle,
  activeButtonStyle,
  tblTdStyle,
  columnThStyle,
};
