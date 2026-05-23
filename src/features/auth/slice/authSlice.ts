import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 1. Puxa a URL do seu arquivo .env
const API_URL = import.meta.env.VITE_API_URL;

// 2. Interface do que a sua API devolve no JSON de sucesso
interface LoginResponse {
  mensagem: string;
  usuarioId: number;
  nome: string;
  email: string;
}

// 3. Interface de como o Redux vai guardar os dados na memória do Front
interface AuthState {
  user: {
    id: number;
    nome: string;
    email: string;
  } | null;
  loading: boolean;
  error: string | null;
  signed: boolean;
}

// Verifica se já existe um usuário logado salvo no navegador
const savedUserId = localStorage.getItem('@App:userId');

const initialState: AuthState = {
  user: null, // Começa nulo até o login responder com sucesso
  loading: false,
  error: null,
  signed: !!savedUserId, // Se achar um ID salvo, assume que está logado
};

// 4. ACTION ASSÍNCRONA: Faz o POST para a sua API enviando email e senha
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { email: string; senha: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post<LoginResponse>(
        `${API_URL}/Auth/login`, 
        {
          email: credentials.email,
          senha: credentials.senha
        }
      );
      
      // Salva o ID do usuário no navegador para não deslogar ao atualizar a página
      localStorage.setItem('@App:userId', String(response.data.usuarioId));
      
      return response.data; // Envia o JSON de resposta para o extraReducers abaixo
    } catch (err: any) {
      // Se der erro (status 400, 401, etc), pega a mensagem do seu JSON de erro
      return rejectWithValue(err.response?.data?.mensagem || 'Erro ao tentar fazer login');
    }
  }
);

// 5. SLICE: Gerencia o estado (carregando, sucesso ou erro)
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Função para quando o usuário clicar em "Sair"
    logout: (state) => {
      localStorage.clear();
      state.user = null;
      state.error = null;
      state.signed = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // 1ª Etapa: Enquanto a requisição está rodando...
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // 2ª Etapa: Se a API responder com sucesso (Status 200)
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          id: action.payload.usuarioId,
          nome: action.payload.nome,
          email: action.payload.email
        };
        state.signed = true;
      })
      // 3ª Etapa: Se a API der algum erro
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string; // Guarda a mensagem para mostrar na tela
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;