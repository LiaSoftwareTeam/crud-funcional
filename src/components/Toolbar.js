import React from 'react';
import { FaUser, FaSignOutAlt, FaStore } from 'react-icons/fa';
import styles from './Toolbar.module.css';

const Toolbar = ({ username = 'Josias Peguero', onLoginClick }) => {
  return (
    <div className={styles.toolbar}>
      <div className={styles.storeName}>
        <FaStore className={styles.storeIcon} />
        <span>Tienda</span>
      </div>
      
      <div className={styles.userSection}>
        <div className={styles.avatar}>
          {username ? (
            username.split(' ').map(name => name[0]).join('').toUpperCase()
          ) : (
            'JP'
          )}
        </div>
        <div className={styles.userInfo}>
          {username ? (
            <>
              <span className={styles.username}>{username}</span>
              <button className={styles.logoutButton}>
                <FaSignOutAlt /> Salir
              </button>
            </>
          ) : (
            <button className={styles.loginButton} onClick={onLoginClick}>
              <FaUser /> Iniciar Sesión
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Toolbar;