import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchSevas = createAsyncThunk(
  'seva/fetchSevas',
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/sevas?page=${page}&limit=${limit}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const sevaSlice = createSlice({
  name: 'seva',
  initialState: {
    sevas: [],
    loading: false,
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
    },
    incrementPage: (state) => {
      state.page += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSevas.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSevas.fulfilled, (state, action) => {
        const newSevas = action.payload.sevas;
        const existingCodes = new Set(state.sevas.map((seva) => seva.code));

        const uniqueSevas = newSevas.filter(
          (seva) => !existingCodes.has(seva.code)
        );
        state.sevas = [...state.sevas, ...uniqueSevas];

        state.totalPages = action.payload.totalPages;
        state.hasMore = state.page < state.totalPages;
        state.loading = false;
      })

      .addCase(fetchSevas.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { resetSevas, incrementPage } = sevaSlice.actions;

export default sevaSlice.reducer;
