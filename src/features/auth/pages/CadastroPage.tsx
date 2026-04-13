import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './CadastroPage.module.css';

export default function CadastroPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  return (
    <div className={styles.wrapper}>
      <form className={styles.modal} onSubmit={(e) => e.preventDefault()}>
        <h2>Criar Conta</h2>
        
        <div className={styles.fieldGroup}>
          <label>Nome Completo</label>
          <input 
            type="text" 
            placeholder="Ex: João Silva" 
            onChange={e => setNome(e.target.value)} 
            required 
          />
        </div>

        <div className={styles.fieldGroup}>
          <label>E-mail</label>
          <input 
            type="email" 
            placeholder="seu@email.com" 
            onChange={e => setEmail(e.target.value)}
            required 
          />
        </div>

        <div className={styles.fieldGroup}>
          <label>Password</label>
          <input 
            type="password" 
            placeholder="Crie uma senha forte" 
            onChange={e => setSenha(e.target.value)}
            required 
          />
        </div>

        <button type="submit" className={styles.saveButton}>Finalizar Cadastro</button>
        
        <p className={styles.footer}>
          Já possui conta? <Link to="/">Voltar ao Login</Link>
        </p>
      </form>
    </div>
  );
}