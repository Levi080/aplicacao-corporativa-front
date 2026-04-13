import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from '../features/auth/pages/LoginPage';
import CadastroPage from '../features/auth/pages/CadastroPage';

const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  { path: "/cadastro", element: <CadastroPage /> },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}