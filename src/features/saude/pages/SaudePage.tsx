import styles from './SaudePage.module.css';

interface Servico {
  id: number;
  titulo: string;
  icone: string;
}

const servicos: Servico[] = [
  { id: 1, titulo: "Registrar Exame", icone: "📋" },
  { id: 2, titulo: "Registrar Afastamento", icone: "🤒" },
  { id: 3, titulo: "Atendimento de Saúde", icone: "🏥" },
];

export default function SaudePage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Serviços de Saúde Ocupacional</h1>
      
      <div className={styles.grid}>
        {servicos.map((servico) => (
          <div key={servico.id} className={styles.card} onClick={() => console.log(servico.titulo)}>
            <span className={styles.icon}>{servico.icone}</span>
            <span className={styles.cardLabel}>{servico.titulo}</span>
          </div>
        ))}
      </div>
    </div>
  );
}