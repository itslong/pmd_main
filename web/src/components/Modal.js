import React from 'react';
import { Button } from './common';

const modalStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(0,0,0,0.6)',
  display: 'block',
}

const modalMainEdit = {
  position: 'fixed',
  background: 'white',
  width: '80%',
  height: 'auto',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  overflowY: 'auto',
  maxHeight: '100%'
}

const modalMainDelete = {
  position: 'fixed',
  background: 'white',
  width: '20%',
  height: '40%',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)'
}

const modalHeaderStyle = {
  background: 'lightGray',
  height: 'auto',
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
}

const modalHeaderButtonStyle = {
  width: '100%',
  display: 'flex',
  justifyContent: 'end',
};

const modalHeaderTextStyle = {
  width: '100%',
};
/**
  handleCloseModal: function to close modal. This should update State in parent.
  showEditModal: only used to dictate className once Css is added.
  headerText: optional text for modal header
  actionType: string: 'edit', or 'delete'. Edit contains the form fields. Delete is a confirmation with button.
  children: props to pass through from parent.
*/

const Modal = ({ handleCloseModal, showEditModal, headerText, actionType, children }) => {
  const modalContainerStyle = (actionType === 'edit') ? modalMainEdit : modalMainDelete;

  return (
    <div className={'modal'} style={modalStyles}>
      <section className='modal-main' style={modalContainerStyle}>
        <section className='modal-header' style={modalHeaderStyle}>
          <div style={modalHeaderTextStyle}>
            <p>{headerText}</p>
          </div>
          <div style={modalHeaderButtonStyle}>
            <Button type={'closeBtn'} title={'X'} action={handleCloseModal} />
          </div>
        </section>
        { children }
      </section>
    </div>
  );
};

export default Modal;
