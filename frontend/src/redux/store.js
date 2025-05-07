import { configureStore } from '@reduxjs/toolkit';
import sevaReducer from './sevaSlice';
import userReducer from './userSlice';
export default configureStore({
  reducer: {
    seva: sevaReducer,
    user: userReducer,
  },
});
