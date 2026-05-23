import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

interface LoginResponse {
  mensagem: string;
  usuarioId: number;
  nome: string;
  email: string;
}

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

const savedUserId = localStorage.getItem('@App:userId');

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  signed: !!savedUserId,
};

// ACTION 1: Login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { email: string; senha: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post<LoginResponse>(
        `${API_URL}/Auth/login`, // ajuste para sua rota se necessário (ex: /api/Auth/login)
        {
          email: credentials.email,
          senha: credentials.senha
        }
      );
      localStorage.setItem('@App:userId', String(response.data.usuarioId));
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.mensagem || 'Erro ao tentar fazer login');
    }
  }
);

// ACTION 2: Cadastro de Usuário Novo
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: { nome: string; email: string; senha: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post<{ mensagem: string }>(
        `${API_URL}/Auth/registrar`,
        {
          nome: userData.nome,
          email: userData.email,
          senha: userData.senha
        }
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.mensagem || 'Erro ao tentar cadastrar usuário');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.clear();
      state.user = null;
      state.error = null;
      state.signed = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Reducers do Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          id: action.payload.usuarioId,
          nome: action.payload.nome,
          email: action.payload.email
        };
        state.signed = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Reducers do Cadastro
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;