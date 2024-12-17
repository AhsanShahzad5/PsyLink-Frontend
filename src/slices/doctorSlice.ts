import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DoctorState {
  isVerified: boolean;
  isClinicSetup: boolean;
}

const initialState: DoctorState = {
  isVerified: false,
  isClinicSetup: false,
};

const doctorSlice = createSlice({
  name: 'doctor',
  initialState,
  reducers: {
    setVerificationStatus: (state, action: PayloadAction<boolean>) => {
      state.isVerified = action.payload;
    },
    setClinicSetupStatus: (state, action: PayloadAction<boolean>) => {
      state.isClinicSetup = action.payload;
    },
  },
});

export const { setVerificationStatus, setClinicSetupStatus } = doctorSlice.actions;
export default doctorSlice.reducer;
