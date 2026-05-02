import { Outlet, Link } from 'react-router-dom';
import styles from './DashboardLayout.module.css';

export default function DashboardLayout() {
  return (
    <div className={styles.container}>

      {/* Sua aba lateral esquerda com módulos */}
      <aside className={styles.sidebar}>
        <h3>Módulos</h3>
        <nav className={styles.nav}>
          <Link to="/home" className={styles.navLink}>Inicio</Link>
          <Link to="/home/rh" className={styles.navLink}>Recursos Humanos</Link>
          <Link to="/home/saude" className={styles.navLink}>Serviços de Saúde</Link>
          <Link to="/home/relatorios" className={styles.navLink}>Relatórios</Link>

          <hr />
          <Link to="/" className={styles.navLink} style={{ color: 'red' }}>Sair</Link>
        </nav>
      </aside>

      {/* Onde o conteúdo das páginas vai aparecer */}
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
}