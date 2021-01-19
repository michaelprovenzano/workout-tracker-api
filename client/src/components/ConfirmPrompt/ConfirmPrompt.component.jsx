import React from 'react';

import Modal from '../Modal/Modal.component';
import Button from '../Button/Button.component';

const ConfirmPrompt = ({ expanded, children, onConfirm, onClose }) => {
  return (
    <Modal expanded={expanded}>
      <div className='m-5'>{children}</div>
      <div className='d-flex justify-content-around'>
        <Button text='Cancel' type='danger' onClick={() => onClose()} />
        <Button text='Confirm' type='primary' onClick={() => onConfirm()} />
      </div>
      <Button text='&times;' type='secondary' onClick={() => onClose()} className='modal-close' />
    </Modal>
  );
};

export default ConfirmPrompt;
