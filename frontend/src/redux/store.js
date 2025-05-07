import { configureStore } from '@reduxjs/toolkit';
import sevaReducer from './sevaSlice';

export default configureStore({
  reducer: {
    seva: sevaReducer,
  },
});
