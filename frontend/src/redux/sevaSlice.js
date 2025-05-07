import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchSevas = createAsyncThunk('seva/fetchSevas', async () => {
  const res = await axios.get('http://localhost:5000/api/sevas');
  return res.data;
});

const sevaSlice = createSlice({
  name: 'seva',
  initialState: {
    sevas: [],
    loading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSevas.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSevas.fulfilled, (state, action) => {
        state.loading = false;
        state.sevas = action.payload;
      });
  },
});

export default sevaSlice.reducer;
