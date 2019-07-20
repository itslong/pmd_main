import React from 'react';
import styled from 'styled-components';

/*
  Prefixes determines the type of component styling.
*/
const StyledButton = styled.button`
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
const StyledTable = styled.table`
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
  padding: 5px 0;

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

const BaseDialogAndModal = styled.div`
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
`;

const StyledModal = styled(BaseDialogAndModal)`
  .modal-container {
    position: fixed;
    background: white;
    height: auto;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .edit-modal {
    width: 60%;
    overflow-y: auto;
    max-height: 100%;
  }

  .del-modal {
    width: 20%;
    height: auto;
  }

  .modal-header {
    background: lightgray;
    height: auto;
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    padding: 0 5px;
  }

  .modal-body {
    padding: 10px;
  }

  .modal-buttons-container {
    padding: 10px 0;

    button {
      width: 100%;
    }
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

const PartsModalButtonContainer = styled.div`
  padding: 10px 0;
  text-align: center;

  button {
    width: ${props => props.actionType == 'edit' ? '80%' : '100%'};
  }
`;

const StyledDialog = styled(BaseDialogAndModal)`
  .dialog-container {
    position: fixed;
    background: white;
    width: 25%;
    height: 20%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 4px;
    
    .dialog-body {
      justify-content: space-evenly;
      align-items: center;
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 10px;
      height: 100%;
      font-size: 16px;

      button {
        width: 40%;
        padding: 2px 0;
      }
    }
  }
`;

export {
  StyledButton,
  StyledTable,
  disabledButtonStyle,
  activeButtonStyle,
  centerHorizontalAndVerticalStyle,
  StyledNavBar,
  StyledModal,
  StyledDialog,
  PartsModalButtonContainer
};
