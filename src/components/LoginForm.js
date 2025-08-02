import React, { useState } from 'react';
import { FaUser, FaLock, FaSpinner } from 'react-icons/fa';
import styles from './LoginForm.module.css';

const LoginForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    // Simulación de inicio de sesión con un retraso de 1 segundo
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulamos un inicio de sesión exitoso
      console.log('Inicio de sesión simulado con:', formData);
      onClose(true);
    } catch (err) {
      setError('Error al iniciar sesión. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginFormContainer}>
      <h2 className={styles.title}>Iniciar Sesión</h2>
      
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            <FaUser className={styles.inputIcon} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Correo electrónico"
              className={styles.input}
              required
            />
          </label>
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>
            <FaLock className={styles.inputIcon} />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Contraseña"
              className={styles.input}
              required
            />
          </label>
        </div>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? (
            <>
              <FaSpinner className={styles.spinner} /> Iniciando...
            </>
          ) : (
            'Iniciar Sesión'
          )}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;