import React, { useState } from 'react';
import styles from './RhPage.module.css';

const initialEmployees = [
  { id: 1, nome: "Ana Silva", cpf: "123.456.789-00", cargo: "Desenvolvedora" },
  { id: 2, nome: "Bruno Costa", cpf: "987.654.321-11", cargo: "Analista de RH" },
  { id: 3, nome: "Carla Souza", cpf: "456.123.789-22", cargo: "Gerente" },
];

export default function RhPage() {
  const [search, setSearch] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState(initialEmployees);

  const handleSearch = () => {
    const result = initialEmployees.filter(emp => 
      emp.nome.toLowerCase().includes(search.toLowerCase()) ||
      emp.cpf.includes(search)
    );
    setFilteredEmployees(result);
  };

  return (
    <div className={styles.container}>
      <h1>Recursos Humanos</h1>

      {/* Controles Superiores */}
      <div className={styles.topControls}>
        
        {/* Grupo da Barra de Pesquisa + Botão Pesquisar */}
        <div className={styles.searchGroup}>
          <input 
            type="text" 
            className={styles.searchBar} 
            placeholder="Nome ou CPF do funcionário..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className={styles.searchButton} onClick={handleSearch}>
            Pesquisar
          </button>
        </div>

        {/* Botão de Cadastro ao lado da pesquisa */}
        <button className={styles.addButton}>
          + Novo Funcionário
        </button>
      </div>

      {/* Listagem */}
      <div className={styles.gridContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Cargo</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map(employee => (
              <tr key={employee.id}>
                <td>{employee.nome}</td>
                <td>{employee.cpf}</td>
                <td>{employee.cargo}</td>
              </tr>
            ))}
            {filteredEmployees.length === 0 && (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center' }}>Nenhum funcionário encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}