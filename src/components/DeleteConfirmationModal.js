import React from 'react';
import Modal from 'react-modal';
import { db } from '../firebase/config';
import { doc, deleteDoc } from 'firebase/firestore';
import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import styles from './DeleteConfirmationModal.module.css';

// Establecer el elemento raíz de la aplicación para el modal
if (typeof window !== 'undefined') {
  Modal.setAppElement('body');
}

const DeleteConfirmationModal = ({ isOpen, onClose, product }) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleDelete = async () => {
    if (!product || !product.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const productRef = doc(db, 'productos', product.id);
      await deleteDoc(productRef);
      onClose(true); // Cerrar modal y refrescar lista
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      setError('Error al eliminar el producto. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => onClose(false)}
      className={styles.modal}
      overlayClassName={styles.overlay}
      contentLabel="Confirmar Eliminación"
    >
      <div className={styles.modalHeader}>
        <h2>Confirmar Eliminación</h2>
        <button className={styles.closeButton} onClick={() => onClose(false)}>
          <FaTimes />
        </button>
      </div>

      <div className={styles.modalContent}>
        <FaExclamationTriangle className={styles.warningIcon} />
        <p>¿Estás seguro de que deseas eliminar el producto <strong>{product?.nombre}</strong>?</p>
        <p className={styles.warningText}>Esta acción no se puede deshacer.</p>
        
        {error && <div className={styles.error}>{error}</div>}
      </div>

      <div className={styles.modalActions}>
        <button 
          className={styles.cancelButton} 
          onClick={() => onClose(false)}
          disabled={loading}
        >
          Cancelar
        </button>
        <button 
          className={styles.deleteButton} 
          onClick={handleDelete}
          disabled={loading}
        >
          {loading ? 'Eliminando...' : 'Eliminar'}
        </button>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;