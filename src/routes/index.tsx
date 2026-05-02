import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from '../features/auth/pages/LoginPage';
import CadastroPage from '../features/auth/pages/CadastroPage';
import HomePage from '../features/home/pages/HomePage';
import DashboardLayout from '../components/Layout/DashboardLayout';
import RhPage from '../features/rh/pages/RhPage';
import SaudePage from '../features/saude/pages/SaudePage';
import RelatoriosPage from '../features/relatorios/pages/RelatoriosPage';


const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  { path: "/cadastro", element: <CadastroPage /> },
  {
    path: "/home",
    element: <DashboardLayout />, // O Layout "abraça" as rotas internas
    children: [
      { path: "", element: <HomePage /> },
      { path: "rh", element: < RhPage/> },
      { path: "saude", element: < SaudePage/> },  
      { path: "relatorios", element: <RelatoriosPage /> },    
    ]
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}