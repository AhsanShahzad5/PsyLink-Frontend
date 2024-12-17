import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PersonalDetails {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  country: string;
  city: string;
  phoneNo: string;
  image: string;
}

interface ProfessionalDetails {
  specialisation: string;
  cnicNumber: string;
  pmdcNumber: string;
  educationalBackground: string;
  availableHours: {
    startTime: string;
    endTime: string;
  };
  consultationFee: string;
  bankDetails: {
    accountHolderName: string;
    accountNumber: string;
    bankName: string;
    branchCode: string;
    iban: string;
  };
  licenseImage: string;
}

interface DoctorDetailsState {
  personalDetails: PersonalDetails | null;
  professionalDetails: ProfessionalDetails | null;
}

const initialState: DoctorDetailsState = {
  personalDetails: null,
  professionalDetails: null,
};

const doctorDetailsSlice = createSlice({
  name: 'doctorDetails',
  initialState,
  reducers: {
    setPersonalDetails(state, action: PayloadAction<PersonalDetails>) {
      state.personalDetails = action.payload;
    },
    setProfessionalDetails(state, action: PayloadAction<ProfessionalDetails>) {
      state.professionalDetails = action.payload;
    },
    resetDoctorDetails(state) {
      state.personalDetails = null;
      state.professionalDetails = null;
    },
  },
});

export const { setPersonalDetails, setProfessionalDetails, resetDoctorDetails } = doctorDetailsSlice.actions;
export default doctorDetailsSlice.reducer;
