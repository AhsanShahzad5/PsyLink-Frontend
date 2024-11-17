import { Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import LoginPage from './pages/Doctor/LoginPage';
import DetailForm from './pages/Patient/DetailForm';
import ChooseSpecialist from './pages/Patient/ChooseSpecialist';
import HomePage from './pages/Patient/HomePage';
import NotesPage from './pages/Patient/NotesPage';
import Prescription from './pages/Patient/Prescriptions';
import DoctorDetailForm from './pages/Doctor/DoctorDetailForm';
import ThankYouPage from './pages/Doctor/ThankYouPage';
import DoctorProfessionalDetailsForm from './pages/Doctor/DoctorProfessionalDetailsForm';
import DoctorHome from './pages/Doctor/DoctorHome';

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
            {/* doctor routes  */}
            <Route path='/doctor/login' element={<LoginPage/> } />
            <Route path='/doctor/home' element={<DoctorHome/> } />
            <Route path='/doctor/detailForm' element={<DoctorDetailForm/>} />
            <Route path='/doctor/professionaldetailForm' element={<DoctorProfessionalDetailsForm/>} />
            <Route path='/doctor/thankyoupage' element={<ThankYouPage/>} />

            {/* testing routes */}
            {/* <Route path='/test' element={<UploadImage/>} /> */}

        </Routes>
    )
}

export default AppRoutes;