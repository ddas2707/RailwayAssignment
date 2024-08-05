// app/Components/Modal.tsx
'use client';

import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, message }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 className='text-black'>Success</h2>
        <p className='text-black'>{message}</p>
        <button style={{color:'red'}} onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed' as 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '500px',
    width: '100%',
    textAlign: 'center' as 'center',
  },
};

export default Modal;
