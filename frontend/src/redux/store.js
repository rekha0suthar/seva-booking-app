import { configureStore } from '@reduxjs/toolkit';
import sevaReducer from './sevaSlice';
import userReducer from './userSlice';
import cartReducer from './cartSlice';
import checkoutReducer from './checkoutSlice';

const store = configureStore({
  reducer: {
    seva: sevaReducer,
    user: userReducer,
    cart: cartReducer,
    checkout: checkoutReducer,
  },
});

export default store;
