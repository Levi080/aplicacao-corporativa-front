import React, { useState } from 'react';
import styles from './RelatoriosPage.module.css';

export default function RelatoriosPage() {
  const [cpf, setCpf] = useState('');

  // Função simples para formatar CPF (000.000.000-00)
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é número
    if (value.length <= 11) {
      value = value.replace(/(\={3})(\={3})(\={3})(\={2})/g, "$1.$2.$3-$4");
      // Nota: Para uma máscara perfeita em tempo real, bibliotecas como react-input-mask são recomendadas.
      // Aqui usaremos o valor limpo ou formatado conforme sua necessidade.
      setCpf(e.target.value); 
    }
  };

  const handleSearch = () => {
    if (cpf.length < 11) {
      alert("Por favor, digite um CPF válido.");
      return;
    }
    console.log("Buscando relatórios para o CPF:", cpf);
    // Aqui entrará a lógica de navegação ou abertura do PDF/Relatório
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleGroup}>
        <h1>Relatórios de Exames</h1>
        <p>Busque pelo CPF para visualizar o histórico completo.</p>
      </div>

      <div className={styles.searchBox}>
        <input 
          type="text" 
          className={styles.inputCpf}
          placeholder="000.000.000-00"
          value={cpf}
          onChange={handleCpfChange}
          maxLength={14}
        />
        <button className={styles.searchButton} onClick={handleSearch}>
          Gerar Relatório
        </button>
      </div>
    </div>
  );
}