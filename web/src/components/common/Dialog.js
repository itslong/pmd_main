import React from 'react';

import Button from './Button';
import { StyledDialog } from './styles';


const Dialog = ({ dialogText, handleCloseDialog }) => {
  // needed to dismiss dialog when parent props isn't available, such as when routing back to Display after successful submit.
  const buttonClose = handleCloseDialog ?
    handleCloseDialog
    : (() => { 
      const successModal = document.querySelector('#single-dialog');
      successModal.setAttribute('style', 'display: none'); 
    });

  return (
    <StyledDialog id={'single-dialog'}>
      <div className='dialog-container'>
        <div className='dialog-body'>
          <p>{dialogText}</p>
          <Button 
            type={'primary'}
            title={'Ok'}
            action={buttonClose}
          />
        </div>
      </div>
    </StyledDialog>
  )
};

export default Dialog;
