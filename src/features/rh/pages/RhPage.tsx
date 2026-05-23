import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  fetchPeople,
  createPerson,
  updatePerson,
  deletePerson,
} from "../slice/peopleSlice";
import type { Pessoa } from "../slice/peopleSlice";
import styles from "./RhPage.module.css";

export default function RhPage() {
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estado para saber se estamos editando alguém
  const [editingPerson, setEditingPerson] = useState<Pessoa | null>(null);

  // Estados do formulário
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [telefone, setTelefone] = useState("");
  const [pessoaTipoId, setPessoaTipoId] = useState(3);

  const { list, loading, error } = useAppSelector((state) => state.people);

  useEffect(() => {
    dispatch(fetchPeople());
  }, [dispatch]);

  const filteredPeople = list.filter(
    (p) =>
      p.nome.toLowerCase().includes(search.toLowerCase()) ||
      p.cpf.includes(search),
  );

  const handleDelete = async (pessoaId: number) => {
    if (confirm("Tem certeza que deseja excluir esta pessoa?")) {
      // Dispara a ação de exclusão passando o ID da linha clicada
      const resultAction = await dispatch(deletePerson(pessoaId));

      if (deletePerson.fulfilled.match(resultAction)) {
        alert("Pessoa excluída com sucesso!");
      }
    }
  };

  // Função para abrir o modal no modo CADASTRO
  const handleOpenCreateModal = () => {
    setEditingPerson(null); // Garante que não há dados antigos
    setNome("");
    setCpf("");
    setNascimento("");
    setTelefone("");
    setPessoaTipoId(3);
    setIsModalOpen(true);
  };

  // Função para abrir o modal no modo EDIÇÃO
  const handleOpenEditModal = (pessoa: Pessoa) => {
    setEditingPerson(pessoa);

    // Preenche os inputs com os dados atuais da pessoa selecionada
    setNome(pessoa.nome);
    setCpf(pessoa.cpf);
    setTelefone(pessoa.telefone);
    setPessoaTipoId(pessoa.pessoaTipoId);

    // Formata a data (YYYY-MM-DD) para o input do tipo 'date' conseguir ler
    if (pessoa.nascimento) {
      setNascimento(pessoa.nascimento.split("T")[0]);
    } else {
      setNascimento("");
    }

    setIsModalOpen(true);
  };

  // Envio do formulário (Decide se vai dar POST ou PUT)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const personData = {
      nome,
      cpf,
      nascimento: new Date(nascimento).toISOString(),
      telefone,
      pessoaTipoId: Number(pessoaTipoId),
      atualizadoPor: 1,
    };

    if (editingPerson) {
      // Se estamos editando, dispara o UPDATE (PUT) incluindo o ID da pessoa
      const resultAction = await dispatch(
        updatePerson({
          ...personData,
          pessoaId: editingPerson.pessoaId,
        }),
      );

      if (updatePerson.fulfilled.match(resultAction)) {
        alert("Dados atualizados com sucesso!");
        setIsModalOpen(false);
      }
    } else {
      // Se não, dispara o CADASTRO (POST)
      const resultAction = await dispatch(createPerson(personData));

      if (createPerson.fulfilled.match(resultAction)) {
        alert("Cadastrado com sucesso!");
        setIsModalOpen(false);
      }
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

        <button className={styles.addButton} onClick={handleOpenCreateModal}>
          + Novo Funcionário
        </button>
      </div>

      {loading && <p style={{ textAlign: "center" }}>Processando...</p>}
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      {!loading && !error && (
        <div className={styles.gridContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th>Telefone</th>
                <th>Cargo / Tipo</th>
                <th style={{ textAlign: "center" }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredPeople.map((pessoa) => (
                <tr key={pessoa.pessoaId}>
                  <td>{pessoa.nome}</td>
                  <td>{pessoa.cpf}</td>
                  <td>{pessoa.telefone}</td>
                  <td>{pessoa.descricaoTipoPessoa}</td>
                  <td>
                    <div className={styles.actionsContainer}>
                      <button
                        className={styles.editButton}
                        onClick={() => handleOpenEditModal(pessoa)} // Passa o objeto completo da pessoa
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDelete(pessoa.pessoaId)}
                        title="Excluir"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* POPUP (MODAL) HÍBRIDO: CADASTRO OU EDIÇÃO */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            {/* O Título muda dinamicamente baseado no estado */}
            <h2>
              {editingPerson
                ? "Editar Funcionário"
                : "Cadastrar Novo Funcionário"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Nome Completo</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>CPF</label>
                <input
                  type="text"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  placeholder="000.000.000-00"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Data de Nascimento</label>
                <input
                  type="date"
                  value={nascimento}
                  onChange={(e) => setNascimento(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Telefone</label>
                <input
                  type="text"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Tipo de Pessoa (Cargo)</label>
                <select
                  value={pessoaTipoId}
                  onChange={(e) => setPessoaTipoId(Number(e.target.value))}
                >
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
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className={styles.saveButton}>
                  {editingPerson ? "Atualizar" : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
