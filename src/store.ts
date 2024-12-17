import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import doctorDetailsReducer from './slices/doctorDetailsSlice';
import doctorSlice from './slices/doctorSlice';
const store = configureStore({
  reducer: {
    auth: authReducer,
    doctorDetails: doctorDetailsReducer,
    doctor: doctorSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
