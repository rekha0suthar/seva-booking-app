import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchSevas = createAsyncThunk(
  'seva/fetchSevas',
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/sevas?page=${page}&limit=${limit}`);
      return res.data;
    } catch (err) {
      console.error('Error fetching sevas:', err);
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const sevaSlice = createSlice({
  name: 'seva',
  initialState: {
    sevas: [],
    loading: false,
    error: null,
    page: 1,
    totalPages: 1,
    hasMore: true,
  },
  reducers: {
    resetSevas: (state) => {
      state.sevas = [];
      state.page = 1;
      state.totalPages = 1;
      state.hasMore = true;
      state.error = null;
    },
    incrementPage: (state) => {
      state.page += 1;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSevas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSevas.fulfilled, (state, action) => {
        const newSevas = action.payload.sevas || [];
        console.log('Received new sevas:', newSevas.length);

        // If it's the first page, replace all sevas
        if (action.meta.arg.page === 1) {
          state.sevas = newSevas;
        } else {
          // For subsequent pages, append unique sevas
          const existingCodes = new Set(state.sevas.map((seva) => seva.code));
          const uniqueSevas = newSevas.filter(
            (seva) => !existingCodes.has(seva.code)
          );
          state.sevas = [...state.sevas, ...uniqueSevas];
        }

        state.totalPages = action.payload.totalPages || 1;
        state.hasMore = state.page < state.totalPages;
        state.loading = false;
      })
      .addCase(fetchSevas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch sevas';
        console.error('Sevas fetch rejected:', action.payload);
      });
  },
});

export const { resetSevas, incrementPage, clearError } = sevaSlice.actions;

export default sevaSlice.reducer;
