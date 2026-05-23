// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import styles from './CadastroPage.module.css';

// export default function CadastroPage() {
//   const [nome, setNome] = useState('');
//   const [email, setEmail] = useState('');
//   const [senha, setSenha] = useState('');

//   return (
//     <div className={styles.wrapper}>
//       <form className={styles.modal} onSubmit={(e) => e.preventDefault()}>
//         <h2>Criar Conta</h2>
        
//         <div className={styles.fieldGroup}>
//           <label>Nome Completo</label>
//           <input 
//             type="text" 
//             placeholder="Ex: João Silva" 
//             onChange={e => setNome(e.target.value)} 
//             required 
//           />
//         </div>

//         <div className={styles.fieldGroup}>
//           <label>E-mail</label>
//           <input 
//             type="email" 
//             placeholder="seu@email.com" 
//             onChange={e => setEmail(e.target.value)}
//             required 
//           />
//         </div>

//         <div className={styles.fieldGroup}>
//           <label>Password</label>
//           <input 
//             type="password" 
//             placeholder="Crie uma senha forte" 
//             onChange={e => setSenha(e.target.value)}
//             required 
//           />
//         </div>

//         <button type="submit" className={styles.saveButton}>Finalizar Cadastro</button>
        
//         <p className={styles.footer}>
//           Já possui conta? <Link to="/">Voltar ao Login</Link>
//         </p>
//       </form>
//     </div>
//   );
// }



import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks'; // Nossos hooks do Redux
import { registerUser } from '../slice/authSlice'; // Nossa action de cadastro
import styles from './CadastroPage.module.css';

export default function CadastroPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Pegamos os estados de carregamento e erro compartilhados do Redux
  const { loading, error } = useAppSelector((state) => state.auth);

  async function handleCadastro(e: React.FormEvent) {
    e.preventDefault();

    // Dispara a action enviando os dados que a sua API espera (nome, email, senha)
    const resultAction = await dispatch(registerUser({ nome, email, senha }));

    // Se o Redux responder que deu certo (fulfilled)
    if (registerUser.fulfilled.match(resultAction)) {
      alert('Usuário cadastrado com sucesso!');
      navigate('/'); // Redireciona o usuário para a tela de Login para ele entrar
    }
  }

  return (
    <div className={styles.wrapper}>
      <form className={styles.modal} onSubmit={handleCadastro}>
        <h2>Criar Conta</h2>
        
        {/* Exibe a mensagem de erro caso o e-mail já exista ou a API falhe */}
        {error && <span style={{ color: 'red', marginBottom: '10px', fontSize: '14px', textAlign: 'center' }}>{error}</span>}
        
        <div className={styles.fieldGroup}>
          <label>Nome Completo</label>
          <input 
            type="text" 
            placeholder="Ex: João Silva" 
            value={nome}
            onChange={e => setNome(e.target.value)} 
            required 
          />
        </div>

        <div className={styles.fieldGroup}>
          <label>E-mail</label>
          <input 
            type="email" 
            placeholder="seu@email.com" 
            value={email}
            onChange={e => setEmail(e.target.value)}
            required 
          />
        </div>

        <div className={styles.fieldGroup}>
          <label>Senha</label>
          <input 
            type="password" 
            placeholder="Crie uma senha forte" 
            value={senha}
            onChange={e => setSenha(e.target.value)}
            required 
          />
        </div>

        {/* Desabilita o botão enquanto a requisição está batendo na sua API */}
        <button type="submit" className={styles.saveButton} disabled={loading}>
          {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
        </button>
        
        <p className={styles.footer}>
          Já possui conta? <Link to="/">Voltar ao Login</Link>
        </p>
      </form>
    </div>
  );
}