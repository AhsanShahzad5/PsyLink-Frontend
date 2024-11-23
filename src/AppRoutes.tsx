import { Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import LoginPage from './pages/Doctor/LoginPage';
import DetailForm from './pages/Patient/DetailForm';
import ChooseSpecialist from './pages/Patient/ChooseSpecialist';
import HomePage from './pages/Patient/HomePage';
import NotesPage from './pages/Patient/NotesPage';
import Prescription from './pages/Patient/Prescriptions';

import ProgramDetails from './pages/Patient/ProgramDetails';
import PrescriptionPopUp from './Components/patient/PrescriptionPopUp';
import DoctorDetailForm from './pages/Doctor/DoctorDetailForm';
import ThankYouPage from './pages/Doctor/ThankYouPage';
import DoctorProfessionalDetailsForm from './pages/Doctor/DoctorProfessionalDetailsForm';
import AdminLogin from './pages/Admin/AdminLogin';
import ExploreDoctor from './pages/Patient/Bookings';
import VideoConsulation from './pages/Patient/VideoConsulation';
import DoctorReviewPage from './pages/Patient/DoctorReview';
import DoctorDetails from './pages/Patient/DoctorDetails';
import LandingPage from './pages/Patient/landingPage';
import AIChatbotPage from './pages/Patient/AIChatbot';
import ProgramsPage from './pages/Patient/Programs';
import ExerciseDetails from './pages/Patient/ExerciseDetails';

const AppRoutes = () => {

    return (
        <Routes>
            {/* general routes  */}
            <Route path='/' element={<App/> } />
            <Route path='*' element={<Navigate to='/' />} />
            <Route path='/login' element={<LoginPage/> } />
            {/* patient routes  */}     
            <Route path='/patient/detailForm' element={<DetailForm/>} />
            <Route path='/patient/chooseSpecialist' element={<ChooseSpecialist/>} />
            <Route path='/patient/Home' element={<HomePage/>} />
            <Route path='/patient/Notes' element={<NotesPage/>} />
            <Route path='/patient/history' element={<Prescription/>} />
            <Route path='/patient/program-details' element={<ProgramDetails/>} />
            <Route path='/patient/prescription' element={<PrescriptionPopUp/>} />
            <Route path='/patient/Bookings' element={<ExploreDoctor/>} />
            <Route path='/patient/video-consultation' element={<VideoConsulation/>} />
            <Route path='/patient/doctor-review' element={<DoctorReviewPage/>} />
            <Route path='/patient/doctor-details' element={<DoctorDetails/>} />
            <Route path='/patient/landing-page' element={<LandingPage/>} />
            <Route path='/patient/Allen' element={<AIChatbotPage/>} />
            <Route path='/patient/Programs' element={<ProgramsPage/>} />
            <Route path='/patient/exercise-details' element={<ExerciseDetails/>} />
            
            {/* doctor routes  */}
            <Route path='/doctor/home' element={<LoginPage/> } />
            <Route path='/doctor/detailForm' element={<DoctorDetailForm/>} />
            <Route path='/doctor/professionaldetailForm' element={<DoctorProfessionalDetailsForm/>} />
            <Route path='/doctor/thankyoupage' element={<ThankYouPage/>} />
            {/* admin routes  */}
            <Route path='/admin/login' element={<AdminLogin/>} />
            {/* testing routes */}
            {/* <Route path='/test' element={<UploadImage/>} /> */}

        </Routes>
    )
}

export default AppRoutes;