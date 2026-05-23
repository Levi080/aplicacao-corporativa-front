import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// 1. Definição da estrutura exata que a sua API retorna no array
export interface Pessoa {
  pessoaId: number;
  nome: string;
  cpf: string;
  nascimento: string;
  telefone: string;
  pessoaTipoId: number;
  descricaoTipoPessoa: string;
  atualizadoPor: number;
  atualizadoEm: string;
}

interface PeopleState {
  list: Pessoa[];
  loading: boolean;
  error: string | null;
}

const initialState: PeopleState = {
  list: [],
  loading: false,
  error: null,
};

// 2. ACTION ASSÍNCRONA: Busca a listagem de pessoas na API
export const fetchPeople = createAsyncThunk(
  "people/fetchPeople",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<Pessoa[]>(`${API_URL}/Pessoa/listar`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.mensagem || "Erro ao carregar listagem de pessoas",
      );
    }
  },
);

export const createPerson = createAsyncThunk(
  "people/createPerson",
  async (
    newPerson: {
      nome: string;
      cpf: string;
      nascimento: string;
      telefone: string;
      pessoaTipoId: number;
      atualizadoPor: number;
    },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const response = await axios.post(
        `${API_URL}/Pessoa/criar`, // Ajuste se a rota do POST for diferente
        newPerson,
      );

      // Se cadastrou com sucesso, dispara a listagem novamente para atualizar a tabela automaticamente!
      dispatch(fetchPeople());

      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.mensagem || "Erro ao cadastrar nova pessoa",
      );
    }
  },
);

// 3. O SLICE
const peopleSlice = createSlice({
  name: "people",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPeople.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPeople.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload; // Injeta o array retornado no estado global
      })
      .addCase(fetchPeople.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createPerson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createPerson.fulfilled, (state) => {
        state.loading = false;
        // O fetchPeople() disparado acima cuidará de atualizar a lista
      })
      .addCase(createPerson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }, 
});
export default peopleSlice.reducer;
