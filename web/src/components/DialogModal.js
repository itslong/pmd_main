import React from 'react';
import { Button }  from './common';


const modalStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(0,0,0,0.6)',
  display: 'block'
}

const modalMain = {
  position: 'fixed',
  background: 'white',
  width: '15%',
  height: '25%',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)'
}

const textBody = {
  justifyContent: 'space-evenly',
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',

}

// may not need showDialog. ONce switched to css, use showDialog to toggle modal display
const DialogModal = ({ dialogText, handleCloseDialog }) => {
  return (
    <div style={modalStyles}>
      <section className='modal-main' style={modalMain}>
        <div style={textBody}>
          {dialogText}
          <Button 
            type={'primary'}
            title={'Ok'}
            action={handleCloseDialog}
          />
          </div>
      </section>
    </div>
  )
};

export default DialogModal;
