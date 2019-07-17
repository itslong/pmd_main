import React from 'react';
import Button from './Button';


const ModalConfirmationForm = ({ handleConfirmButton, handleCancelButton }) => {
  return (
    <form>
      <div className='modal-buttons-container'>
        <Button
          type={'submitBtn'}
          title={'Confirm'}
          action={handleConfirmButton}
        />

        <Button
          type={'closeBtn'}
          title={'Cancel'}
          action={handleCancelButton}
        />
      </div>
    </form>
  )
}

export default ModalConfirmationForm;
