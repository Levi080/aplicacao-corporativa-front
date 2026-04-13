import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './LoginPage.module.css'; // Importação do módulo

export default function LoginPage() {
  const [email, setEmail] = useState('');

  return (
    <div className={styles.wrapper}>
      <form className={styles.modal} onSubmit={(e) => e.preventDefault()}>
        <h2>Login</h2>
        
        <div className={styles.fieldGroup}>
          <label>E-mail</label>
          <input 
            type="email" 
            placeholder="Seu e-mail" 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
        </div>

        <div className={styles.fieldGroup}>
          <label>Password</label>
          <input 
            type="password" 
            placeholder="Sua senha" 
            required 
          />
        </div>

        <button type="submit" className={styles.loginButton}>Entrar</button>
        
        <p className={styles.footer}>
          Novo aqui? <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </form>
    </div>
  );
}