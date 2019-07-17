import React from 'react';
import Button from './Button';


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
  padding: '10px',
  height: '100%',
  fontSize: '14px',
  textAlign: 'center',
}


const Dialog = ({ dialogText, headerText, handleCloseDialog }) => {

  // use when css is added.
  const showHideClassName = handleCloseDialog ? 'modal display-block' : 'modal display-none';

  const buttonClose = handleCloseDialog ?
    handleCloseDialog
    : (() => { 
      const successModal = document.querySelector('#single-modal');
      successModal.setAttribute('style', 'display: none'); 
    });

  return (
    <div id={'single-modal'} style={modalStyles} className={showHideClassName}>
      <section className='modal-main' style={modalMain}>
        <div style={textBody}>
          {dialogText}
          <Button 
            type={'primary'}
            title={'Ok'}
            action={buttonClose}
          />
        </div>
      </section>
    </div>
  )
};

export default Dialog;
