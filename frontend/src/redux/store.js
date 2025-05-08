import { configureStore } from '@reduxjs/toolkit';
import sevaReducer from './sevaSlice';
import userReducer from './userSlice';
import cartReducer from './cartSlice';

const store = configureStore({
  reducer: {
    seva: sevaReducer,
    user: userReducer,
    cart: cartReducer,
  },
});

export default store;
