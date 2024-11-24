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
import DoctorHome from './pages/Doctor/DoctorHome';
import AdminLogin from './pages/Admin/AdminLogin';
import ExploreDoctor from './pages/Patient/Bookings';
import VideoConsulation from './pages/Patient/VideoConsulation';
import DoctorReviewPage from './pages/Patient/DoctorReview';
import DoctorDetails from './pages/Patient/DoctorDetails';
import LandingPage from './pages/Patient/landingPage';
import AIChatbotPage from './pages/Patient/AIChatbot';
import ProgramsPage from './pages/Patient/Programs';
import ExerciseDetails from './pages/Patient/ExerciseDetails';

import DoctorNavbar from './Components/DoctorNavbar';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorClinic from './pages/Doctor/DoctorClinic';
import DoctorPsync from './pages/Doctor/DoctorPsync';
import DoctorLayout from './layouts/DoctorLayout';
import NavbarSideUserProfileMenu from './Components/NavbarSideUserProfileMenu';
import PatientLayout from './layouts/PatientLayout';


const AppRoutes = () => {

    return (
        <Routes>
            {/* general routes  */}
            <Route path='/' element={<App />} />
            <Route path='*' element={<Navigate to='/' />} />

            <Route path='/login' element={<LoginPage/> } />
            {/* patient routes  */}     
            <Route path='/patient/detailForm' element={<PatientLayout> <DetailForm/> </PatientLayout>} />
            <Route path='/patient/chooseSpecialist' element={<ChooseSpecialist/>} />
            <Route path='/patient/home' element={<PatientLayout><HomePage/> </PatientLayout>} />
            <Route path='/patient/notes' element={<PatientLayout> <NotesPage/> </PatientLayout>} />
            <Route path='/patient/history' element={<PatientLayout> <Prescription/> </PatientLayout>} />
            <Route path='/patient/program-details' element={<PatientLayout> <ProgramDetails/> </PatientLayout>} />
            <Route path='/patient/prescription' element={<PrescriptionPopUp/>} />
            <Route path='/patient/bookings' element={<PatientLayout> <ExploreDoctor/> </PatientLayout>} />
            <Route path='/patient/video-consultation' element={<VideoConsulation/>} />
            <Route path='/patient/doctor-review' element={<DoctorReviewPage/>} />
            <Route path='/patient/doctor-details' element={<DoctorDetails/>} />
            <Route path='/patient/landing-page' element={<LandingPage/>} />
            <Route path='/patient/Allen' element={<PatientLayout> <AIChatbotPage/> </PatientLayout>} />
            <Route path='/patient/Programs' element={<PatientLayout> <ProgramsPage/> </PatientLayout>} />
            <Route path='/patient/exercise-details' element={<PatientLayout> <ExerciseDetails/> </PatientLayout>} />
            

            {/* doctor routes  */}
            <Route path='/doctor/login' element={<LoginPage />} />
            <Route path='/doctor/home' element={<DoctorLayout> <DoctorHome/> </DoctorLayout> }/>
            <Route path='/doctor/appointments' element={ <DoctorLayout><DoctorAppointments /></DoctorLayout>}/>
            <Route path='/doctor/clinic' element={ <DoctorLayout>  <DoctorClinic/>  </DoctorLayout> } />
            <Route path='/doctor/psync' element={<DoctorLayout><DoctorPsync /></DoctorLayout>}/>

            <Route path='/doctor/detailForm' element={<DoctorDetailForm />} />
            <Route path='/doctor/professionaldetailForm' element={<DoctorProfessionalDetailsForm />} />
            <Route path='/doctor/thankyoupage' element={<ThankYouPage />} />
            {/* admin routes  */}
            <Route path='/admin/login' element={<AdminLogin />} />
            {/* testing routes */}
            <Route path='/test' element={<NavbarSideUserProfileMenu/>} />

        </Routes>
    )
}

export default AppRoutes;