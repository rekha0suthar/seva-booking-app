import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const verifyOtp = createAsyncThunk(
  'user/verifyOtp',
  async ({ contact, otp }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/users/verify-otp',
        {
          contact,
          otp,
        }
      );
      return res.data.user; // return user data on success
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || 'Verification failed'
      );
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: null,
    loading: false,
    error: null,
    verified: false,
  },
  reducers: {
    logout: (state) => {
      state.data = null;
      state.verified = false;
      localStorage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.verified = true;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.verified = false;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
