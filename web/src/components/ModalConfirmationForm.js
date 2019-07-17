import React from 'react';

import { Button } from './common';


const ModalConfirmationForm = ({ handleConfirmButton, handleCancelButton }) => {

  return (
    <form>
      <div style={{ textAlign: 'center' }}>
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
};

export default ModalConfirmationForm;
