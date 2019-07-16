import React from 'react';
import styled from 'styled-components';

/*
  Prefixes determines the type of component styling.
  G: Global style
*/
const GButton = styled.button`
  background: ${props => buttonBackgroundColor[props.className]};
  color: ${props => buttonFontColor[props.className]};
  cursor: pointer;
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
*/
const GTable = styled.table`
  table-layout: fixed;
  width: 100%;
  word-wrap: break-word;
  border: 1px solid #bcc0b7;
  font-size: 14px;

  thead > tr > th {
    width: auto;
    color: #9A0008;
    text-align: center;
    vertical-align: middle;
    border: 1px solid #bcc0b7;
  }

  td {
    text-align: center;
    vertical-align: middle;
    border: 1px solid #bcc0b7;
  }

  .dbl-task-header {
    text-align: center;
    background-color: #5e9ca1;
  }

  .dbl-addon-header {
    text-align: center;
    background-color: #A1635E;
  }
`;

const StyledNavBar = styled.div`
  background-color: black;
  margin-bottom: 10px;
  ul {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-evenly;
    list-style: none;
  }

  p {
    color: #FF8C00;
  }
    a {
      color: ivory;
    }
`;


const centerHorizontalAndVerticalStyle = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  width: 'auto',
  height: 'auto',
  transform: 'translate(-50%, -50%)',
};


export {
  GButton,
  GTable,
  disabledButtonStyle,
  activeButtonStyle,
  centerHorizontalAndVerticalStyle,
  StyledNavBar,
};
