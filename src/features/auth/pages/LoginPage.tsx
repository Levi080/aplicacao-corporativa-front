// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import styles from './LoginPage.module.css';

// export default function LoginPage() {
//   const [email, setEmail] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = (e: React.FormEvent) => {
//     e.preventDefault();
//     // Após validar o login:
//     console.log("Passou no login")
//     navigate('/home');
//   };

//   return (
//     <div className={styles.wrapper}>
//       <form className={styles.modal} onSubmit={(e) => e.preventDefault()}>
//         <h2>Login</h2>

//         <div className={styles.fieldGroup}>
//           <label>E-mail</label>
//           <input
//             type="email"
//             placeholder="Seu e-mail"
//             onChange={e => setEmail(e.target.value)}
//             required
//           />
//         </div>

//         <div className={styles.fieldGroup}>
//           <label>Password</label>
//           <input
//             type="password"
//             placeholder="Sua senha"
//             required
//           />
//         </div>

//         <button type="submit" className={styles.loginButton} onClick={handleLogin}>Entrar</button>

//         <p className={styles.footer}>
//           Novo aqui? <Link to="/cadastro">Cadastre-se</Link>
//         </p>
//       </form>
//     </div>
//   );
// }


import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { loginUser } from '../slice/authSlice';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Puxa as variáveis de loading e erro direto do Redux
  const { loading, error } = useAppSelector((state) => state.auth);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    
    // Dispara a Action enviando "email" e "senha" (conforme sua API espera)
    const resultAction = await dispatch(loginUser({ email, senha: password }));

    // Se a action terminou com sucesso, joga o usuário para a Home
    if (loginUser.fulfilled.match(resultAction)) {
      navigate('/home');
    }
  }

  return (
    <div className={styles.wrapper}>
      <form className={styles.modal} onSubmit={handleLogin}>
        <h2>Login</h2>
        
        {/* Mostra o erro caso a API devolva credenciais inválidas */}
        {error && <span style={{ color: 'red', marginBottom: '10px', fontSize: '14px', textAlign: 'center' }}>{error}</span>}

        <div className={styles.fieldGroup}>
          <label>E-mail</label>
          <input 
            type="email" 
            placeholder="Seu e-mail" 
            value={email}
            onChange={e => setEmail(e.target.value)} 
            required 
          />
        </div>

        <div className={styles.fieldGroup}>
          <label>Password</label>
          <input 
            type="password" 
            placeholder="Sua senha" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            required 
          />
        </div>

        {/* Desabilita o botão enquanto carrega para evitar cliques duplos */}
        <button type="submit" className={styles.loginButton} disabled={loading}>
          {loading ? 'Carregando...' : 'Entrar'}
        </button>
        
        <p className={styles.footer}>
          Novo aqui? <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </form>
    </div>
  );
}