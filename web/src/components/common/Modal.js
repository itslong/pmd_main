import React from 'react';

import Button from './Button';
import ModalConfirmationForm from './ModalConfirmationForm';
import { StyledModal } from './styles';



const Modal = ({ handleCloseModal, handleConfirmButton, displayType, headerText, actionType, children, itemName }) => {
  const modalContainerClass = (actionType === 'edit') ? 'edit-modal' : 'del-modal';

  const partsChildrenOrForm = displayType == 'parts' ? children : actionType == 'delete' ?
    <div>
      <p>Are you sure you want to delete: {itemName}?</p>
      <ModalConfirmationForm
        handleConfirmButton={handleConfirmButton}
        handleCancelButton={handleCloseModal}
      />
    </div>
    : '';

  return (
    <StyledModal>
      <div className={`modal-container ${modalContainerClass}`}>
        <div className='modal-header'>
            <p>{headerText}</p>
            <Button type={'closeBtn'} title={'X'} action={handleCloseModal} />
        </div>
        <div className='modal-body'>
          { partsChildrenOrForm }
        </div>
      </div>
    </StyledModal>
  );
};

export default Modal;
