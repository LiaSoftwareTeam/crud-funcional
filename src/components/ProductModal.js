import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { db } from '../firebase/config';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { FaTimes } from 'react-icons/fa';
import styles from './ProductModal.module.css';

// Establecer el elemento raíz de la aplicación para el modal
if (typeof window !== 'undefined') {
  Modal.setAppElement('body');
}

const ProductModal = ({ isOpen, onClose, product, isEditing }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    imagen: '',
    descripcion: '',
    precio: '',
    cantidad: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (product && isEditing) {
      setFormData({
        nombre: product.nombre || '',
        imagen: product.imagen || '',
        descripcion: product.descripcion || '',
        precio: product.precio || '',
        cantidad: product.cantidad || ''
      });
    } else {
      // Resetear el formulario si no estamos editando
      setFormData({
        nombre: '',
        imagen: '',
        descripcion: '',
        precio: '',
        cantidad: ''
      });
    }
  }, [product, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validar campos
      if (!formData.nombre || !formData.imagen || !formData.descripcion || !formData.precio || !formData.cantidad) {
        throw new Error('Todos los campos son obligatorios');
      }

      // Validar que precio y cantidad sean números
      const precio = parseFloat(formData.precio);
      const cantidad = parseInt(formData.cantidad);

      if (isNaN(precio) || precio <= 0) {
        throw new Error('El precio debe ser un número mayor que 0');
      }

      if (isNaN(cantidad) || cantidad <= 0) {
        throw new Error('La cantidad debe ser un número entero mayor que 0');
      }

      const productData = {
        nombre: formData.nombre,
        imagen: formData.imagen,
        descripcion: formData.descripcion,
        precio: precio,
        cantidad: cantidad,
        fechaCreacion: new Date()
      };

      if (isEditing && product.id) {
        // Actualizar producto existente
        const productRef = doc(db, 'productos', product.id);
        await updateDoc(productRef, productData);
      } else {
        // Crear nuevo producto
        await addDoc(collection(db, 'productos'), productData);
      }

      onClose(true); // Cerrar modal y refrescar lista
    } catch (err) {
      console.error('Error al guardar producto:', err);
      setError(err.message);
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
      contentLabel={isEditing ? 'Editar Producto' : 'Agregar Producto'}
    >
      <div className={styles.modalHeader}>
        <h2>{isEditing ? 'Editar Producto' : 'Agregar Producto'}</h2>
        <button className={styles.closeButton} onClick={() => onClose(false)}>
          <FaTimes />
        </button>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Nombre del producto"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="imagen">URL de la imagen:</label>
          <input
            type="text"
            id="imagen"
            name="imagen"
            value={formData.imagen}
            onChange={handleChange}
            placeholder="https://ejemplo.com/imagen.jpg"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="descripcion">Descripción:</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Descripción del producto"
            rows="3"
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="precio">Precio:</label>
            <input
              type="number"
              id="precio"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="cantidad">Cantidad disponible:</label>
            <input
              type="number"
              id="cantidad"
              name="cantidad"
              value={formData.cantidad}
              onChange={handleChange}
              placeholder="0"
              min="0"
              step="1"
            />
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.formActions}>
          <button 
            type="button" 
            className={styles.cancelButton} 
            onClick={() => onClose(false)}
            disabled={loading}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Guardar'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductModal;"// Estilos mejorados del modal de producto" 
