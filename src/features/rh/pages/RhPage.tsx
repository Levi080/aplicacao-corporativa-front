// import React, { useState } from 'react';
// import styles from './RhPage.module.css';

// const initialEmployees = [
//   { id: 1, nome: "Ana Silva", cpf: "123.456.789-00", cargo: "Desenvolvedora" },
//   { id: 2, nome: "Bruno Costa", cpf: "987.654.321-11", cargo: "Analista de RH" },
//   { id: 3, nome: "Carla Souza", cpf: "456.123.789-22", cargo: "Gerente" },
// ];

// export default function RhPage() {
//   const [search, setSearch] = useState('');
//   const [filteredEmployees, setFilteredEmployees] = useState(initialEmployees);

//   const handleSearch = () => {
//     const result = initialEmployees.filter(emp => 
//       emp.nome.toLowerCase().includes(search.toLowerCase()) ||
//       emp.cpf.includes(search)
//     );
//     setFilteredEmployees(result);
//   };

//   return (
//     <div className={styles.container}>
//       <h1>Recursos Humanos</h1>

//       {/* Controles Superiores */}
//       <div className={styles.topControls}>
        
//         {/* Grupo da Barra de Pesquisa + Botão Pesquisar */}
//         <div className={styles.searchGroup}>
//           <input 
//             type="text" 
//             className={styles.searchBar} 
//             placeholder="Nome ou CPF do funcionário..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//           <button className={styles.searchButton} onClick={handleSearch}>
//             Pesquisar
//           </button>
//         </div>

//         {/* Botão de Cadastro ao lado da pesquisa */}
//         <button className={styles.addButton}>
//           + Novo Funcionário
//         </button>
//       </div>

//       {/* Listagem */}
//       <div className={styles.gridContainer}>
//         <table className={styles.table}>
//           <thead>
//             <tr>
//               <th>Nome</th>
//               <th>CPF</th>
//               <th>Cargo</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredEmployees.map(employee => (
//               <tr key={employee.id}>
//                 <td>{employee.nome}</td>
//                 <td>{employee.cpf}</td>
//                 <td>{employee.cargo}</td>
//               </tr>
//             ))}
//             {filteredEmployees.length === 0 && (
//               <tr>
//                 <td colSpan={3} style={{ textAlign: 'center' }}>Nenhum funcionário encontrado.</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }



import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchPeople, createPerson } from '../slice/peopleSlice';
import styles from './RhPage.module.css';

export default function RhPage() {
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState('');
  
  // Estado para controlar a abertura do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estados dos campos do formulário de cadastro
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [pessoaTipoId, setPessoaTipoId] = useState(3); // Começa com Paciente (3) padrão

  const { list, loading, error } = useAppSelector((state) => state.people);

  useEffect(() => {
    dispatch(fetchPeople());
  }, [dispatch]);

  const filteredPeople = list.filter(p => 
    p.nome.toLowerCase().includes(search.toLowerCase()) || p.cpf.includes(search)
  );

  // Envio do formulário do Popup
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newPersonData = {
      nome,
      cpf,
      // Converte a data do input (YYYY-MM-DD) para formato ISO que a API aguarda
      nascimento: new Date(nascimento).toISOString(), 
      telefone,
      pessoaTipoId: Number(pessoaTipoId),
      atualizadoPor: 1 // ID do usuário logado (exemplo estático)
    };

    const resultAction = await dispatch(createPerson(newPersonData));

    if (createPerson.fulfilled.match(resultAction)) {
      alert("Cadastrado com sucesso!");
      setIsModalOpen(false); // Fecha o Popup
      // Limpa os campos do formulário
      setNome(''); setCpf(''); setNascimento(''); setTelefone(''); setPessoaTipoId(3);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Recursos Humanos</h1>

      <div className={styles.topControls}>
        <div className={styles.searchGroup}>
          <input 
            type="text" 
            className={styles.searchBar} 
            placeholder="Nome ou CPF do funcionário..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className={styles.searchButton}>Pesquisar</button>
        </div>

        {/* Clicar aqui abre o Popup */}
        <button className={styles.addButton} onClick={() => setIsModalOpen(true)}>
          + Novo Funcionário
        </button>
      </div>

      {loading && <p style={{ textAlign: 'center' }}>Processando...</p>}
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      {/* Tabela de Listagem */}
      {!loading && !error && (
        <div className={styles.gridContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th>Cargo / Tipo</th>
              </tr>
            </thead>
            <tbody>
              {filteredPeople.map(pessoa => (
                <tr key={pessoa.pessoaId}>
                  <td>{pessoa.nome}</td>
                  <td>{pessoa.cpf}</td>
                  <td>{pessoa.descricaoTipoPessoa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* POPUP (MODAL) DE CADASTRO */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Cadastrar Novo Funcionário</h2>
            
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Nome Completo</label>
                <input type="text" value={nome} onChange={e => setNome(e.target.value)} required />
              </div>

              <div className={styles.formGroup}>
                <label>CPF</label>
                <input type="text" value={cpf} onChange={e => setCpf(e.target.value)} placeholder="000.000.000-00" required />
              </div>

              <div className={styles.formGroup}>
                <label>Data de Nascimento</label>
                <input type="date" value={nascimento} onChange={e => setNascimento(e.target.value)} required />
              </div>

              <div className={styles.formGroup}>
                <label>Telefone</label>
                <input type="text" value={telefone} onChange={e => setTelefone(e.target.value)} placeholder="(00) 00000-0000" required />
              </div>

              <div className={styles.formGroup}>
                <label>Tipo de Pessoa (Cargo)</label>
                <select value={pessoaTipoId} onChange={e => setPessoaTipoId(Number(e.target.value))}>
                  <option value={1}>Enfermeiro(a)</option>
                  <option value={2}>Médico(a)</option>
                  <option value={3}>Paciente</option>
                  <option value={4}>Segurança</option>
                  <option value={5}>Porteiro</option>
                  <option value={6}>Anestesista</option>
                  <option value={7}>Recepcionista</option>
                </select>
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelButton} onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className={styles.saveButton}>
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}