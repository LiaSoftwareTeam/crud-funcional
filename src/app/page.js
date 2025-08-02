'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { db } from '../firebase/config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import ProductModal from '../components/ProductModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import ProductDetails from '../components/ProductDetails';
import Toolbar from '../components/Toolbar';
import LoginModal from '../components/LoginModal';
import styles from '../styles/ProductTable.module.css';
import { FaPlus, FaEye, FaEdit, FaTrash, FaBox, FaSearch, FaTimes } from 'react-icons/fa';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para modales
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Simulamos que el usuario ya está logueado

  // Cargar productos desde Firestore
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'productos'), orderBy('fechaCreacion', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const productsData = [];
      querySnapshot.forEach((doc) => {
        productsData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setProducts(productsData);
      setError(null);
    } catch (err) {
      console.error('Error al cargar productos:', err);
      setError('Error al cargar los productos. Por favor, intenta de nuevo.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filtrar productos por término de búsqueda
  const filteredProducts = products.filter(product => 
    product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Abrir modal para agregar producto
  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsEditing(false);
    setIsProductModalOpen(true);
  };

  // Abrir modal para editar producto
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsEditing(true);
    setIsProductModalOpen(true);
  };

  // Abrir modal para confirmar eliminación
  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  // Abrir modal para ver detalles
  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
  };

  // Cerrar modal de producto y refrescar si es necesario
  const handleCloseProductModal = (refresh) => {
    setIsProductModalOpen(false);
    if (refresh) {
      fetchProducts();
    }
  };

  // Cerrar modal de eliminación y refrescar si es necesario
  const handleCloseDeleteModal = (refresh) => {
    setIsDeleteModalOpen(false);
    if (refresh) {
      fetchProducts();
    }
  };

  // Cerrar modal de vista de detalles
  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
  };

  // Abrir modal de inicio de sesión
  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  // Cerrar modal de inicio de sesión
  const handleCloseLoginModal = (loggedIn) => {
    setIsLoginModalOpen(false);
    if (loggedIn) {
      setIsLoggedIn(true);
    }
  };

  return (
    <div className={styles.container}>
      <Toolbar 
        username={isLoggedIn ? 'Josias Peguero' : null}
        onLoginClick={handleLoginClick}
      />
      
      <div className={styles.header}>
        <h1 className={styles.title}>Productos</h1>
        <button className={styles.addButton} onClick={handleAddProduct}>
          <FaPlus className={styles.addButtonIcon} /> Agregar Producto
        </button>
      </div>

      <div className={styles.searchContainer}>
        <div className={styles.searchBox}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
        </div>
      ) : error ? (
        <div className={styles.errorContainer}>
          <p>{error}</p>
          <button onClick={fetchProducts}>Reintentar</button>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    {product.imagen ? (
                      <img 
                        src={product.imagen} 
                        alt={product.nombre} 
                        className={styles.productImage} 
                      />
                    ) : (
                      <div className={styles.noImage}>Sin imagen</div>
                    )}
                  </td>
                  <td>{product.nombre}</td>
                  <td>
                    {product.descripcion.length > 50
                      ? `${product.descripcion.substring(0, 50)}...`
                      : product.descripcion}
                  </td>
                  <td className={styles.price}>{formatPrice(product.precio)}</td>
                  <td>{product.cantidad}</td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={`${styles.actionButton} ${styles.viewButton}`}
                        onClick={() => handleViewProduct(product)}
                        title="Ver detalles"
                      >
                        <FaEye />
                      </button>
                      <button
                        className={`${styles.actionButton} ${styles.editButton}`}
                        onClick={() => handleEditProduct(product)}
                        title="Editar producto"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                        onClick={() => handleDeleteClick(product)}
                        title="Eliminar producto"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <FaBox className={styles.emptyStateIcon} />
          <p className={styles.emptyStateText}>
            {searchTerm
              ? 'No se encontraron productos que coincidan con tu búsqueda.'
              : 'No hay productos disponibles. ¡Agrega tu primer producto!'}
          </p>
          {!searchTerm && (
            <button className={styles.addButton} onClick={handleAddProduct}>
              <FaPlus className={styles.addButtonIcon} /> Agregar Producto
            </button>
          )}
        </div>
      )}

      {/* Modal para agregar/editar producto */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={handleCloseProductModal}
        product={selectedProduct}
        isEditing={isEditing}
      />

      {/* Modal para confirmar eliminación */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        product={selectedProduct}
      />

      {/* Modal para ver detalles del producto */}
      {isViewModalOpen && selectedProduct && (
        <div className={styles.viewModalOverlay} onClick={handleCloseViewModal}>
          <div className={styles.viewModalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeViewButton} onClick={handleCloseViewModal}>
              <FaTimes />
            </button>
            <ProductDetails product={selectedProduct} />
          </div>
        </div>
      )}

      {/* Modal de inicio de sesión */}
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={handleCloseLoginModal}
      />
    </div>
  );
}
