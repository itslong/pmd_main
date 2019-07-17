import React from 'react';
import { Button, StyledModal } from './common';


const Modal = ({ handleCloseModal, showEditModal, headerText, actionType, children }) => {
  const modalContainerClass = (actionType === 'edit') ? 'edit-modal' : 'del-modal';

  return (
    <StyledModal>
        <div className={`modal-container ${modalContainerClass}`}>
          <div className='modal-header'>
              <p>{headerText}</p>
              <Button type={'closeBtn'} title={'X'} action={handleCloseModal} />
          </div>
          <div className='modal-body'>
            { children }
          </div>
        </div>
    </StyledModal>
  );
};

export default Modal;
