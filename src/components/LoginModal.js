import React from 'react';
import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa';
import LoginForm from './LoginForm';
import styles from './LoginModal.module.css';

// Establecer el elemento raíz de la aplicación para el modal
if (typeof window !== 'undefined') {
  Modal.setAppElement('body');
}

const LoginModal = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => onClose(false)}
      className={styles.modal}
      overlayClassName={styles.overlay}
      contentLabel="Iniciar Sesión"
    >
      <div className={styles.modalHeader}>
        <button className={styles.closeButton} onClick={() => onClose(false)}>
          <FaTimes />
        </button>
      </div>
      
      <LoginForm onClose={onClose} />
    </Modal>
  );
};

export default LoginModal;