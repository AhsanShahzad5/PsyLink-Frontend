import { Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import LoginPage from './pages/Doctor/LoginPage';
import DetailForm from './pages/Patient/DetailForm';
import ChooseSpecialist from './pages/Patient/ChooseSpecialist';
import HomePage from './pages/Patient/HomePage';
import NotesPage from './pages/Patient/NotesPage';
import Prescription from './pages/Patient/Prescriptions';

import ProgramDetails from './pages/Patient/ProgramDetails';
import PrescriptionPopUp from './Components/PrescriptionPopUp';
import DoctorDetailForm from './pages/Doctor/DoctorDetailForm';
import ThankYouPage from './pages/Doctor/ThankYouPage';
import DoctorProfessionalDetailsForm from './pages/Doctor/DoctorProfessionalDetailsForm';
import DoctorHome from './pages/Doctor/DoctorHome';
import AdminLogin from './pages/Admin/AdminLogin';
import DoctorNavbar from './components/DoctorNavbar';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorClinic from './pages/Doctor/DoctorClinic';
import DoctorPsync from './pages/Doctor/DoctorPsync';
import DoctorLayout from './layouts/DoctorLayout';
import NavbarSideUserProfileMenu from './components/NavbarSideUserProfileMenu';

const AppRoutes = () => {

    return (
        <Routes>
            {/* general routes  */}
            <Route path='/' element={<App />} />
            <Route path='*' element={<Navigate to='/' />} />
            <Route path='/login' element={<LoginPage />} />
            {/* patient routes  */}
            <Route path='/patient/detailForm' element={<DetailForm />} />
            <Route path='/patient/chooseSpecialist' element={<ChooseSpecialist />} />
            <Route path='/patient/Home' element={<HomePage />} />
            <Route path='/patient/Notes' element={<NotesPage />} />
            <Route path='/patient/history' element={<Prescription />} />
            <Route path='/patient/program-details' element={<ProgramDetails />} />
            <Route path='/patient/prescription' element={<PrescriptionPopUp />} />

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