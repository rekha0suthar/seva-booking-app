import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: null,
  },
  reducers: {
    saveUser: (state, action) => {
      state.data = action.payload;
    },
    logout: (state) => {
      state.data = null;
    },
  },
});

export const { saveUser, logout } = userSlice.actions;
export default userSlice.reducer;
