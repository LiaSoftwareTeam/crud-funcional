import React from 'react';
import Image from 'next/image';
import styles from './ProductDetails.module.css';

const ProductDetails = ({ product }) => {
  if (!product) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className={styles.productDetails}>
      <div className={styles.imageContainer}>
        {product.imagen ? (
          <img 
            src={product.imagen} 
            alt={product.nombre} 
            className={styles.productImage}
          />
        ) : (
          <div className={styles.noImage}>Sin imagen</div>
        )}
      </div>
      
      <div className={styles.info}>
        <h2 className={styles.productName}>{product.nombre}</h2>
        
        <div className={styles.priceStock}>
          <div className={styles.price}>
            <span className={styles.label}>Precio:</span>
            <span className={styles.value}>{formatPrice(product.precio)}</span>
          </div>
          
          <div className={styles.stock}>
            <span className={styles.label}>Disponibles:</span>
            <span className={styles.value}>{product.cantidad} unidades</span>
          </div>
        </div>
        
        <div className={styles.description}>
          <h3>Descripción:</h3>
          <p>{product.descripcion}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;