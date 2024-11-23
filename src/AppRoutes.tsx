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
import AdminLogin from './pages/Admin/AdminLogin';
import Dashboard from './pages/Admin/Dashboard';
import Layout from './pages/Admin/Layout';
import Patients from './pages/Admin/Patients';
import Doctors from './pages/Admin/Doctors';
import Sessions from './pages/Admin/Sessions';
import Complaints from './pages/Admin/Complaints';
import Reports from './pages/Admin/Reports';
import Payments from './pages/Admin/Payments';
import Psync from './pages/Admin/Psync';
import PatientDetails from './pages/Admin/PatientDetails';

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
            
            {/* doctor routes  */}
            <Route path='/doctor/home' element={<LoginPage/> } />
            <Route path='/doctor/detailForm' element={<DoctorDetailForm/>} />
            <Route path='/doctor/professionaldetailForm' element={<DoctorProfessionalDetailsForm/>} />
            <Route path='/doctor/thankyoupage' element={<ThankYouPage/>} />
            {/* admin routes  */}
            <Route path='/admin/login' element={<AdminLogin/>} />
            <Route path="/" element={<Layout />}>
                    <Route path="/admin/dashboard" element={<Dashboard />} />
                    <Route path="/admin/patients" element={<Patients />} />
                    <Route path="/admin/patients/patient-details" element={<PatientDetails />} />
                    <Route path="/admin/doctors" element={<Doctors />} />
                    <Route path="/admin/sessions" element={<Sessions />} />
                    <Route path="/admin/complaints" element={<Complaints />} />
                    <Route path="/admin/reports" element={<Reports />} />
                    <Route path="/admin/payments" element={<Payments />} />
                    <Route path="/admin/psync" element={<Psync />} />
                    

                    {/* <Route path="/admin/settings" element={<Settings />} /> */}
                </Route>
            {/* testing routes */}
            {/* <Route path='/test' element={<UploadImage/>} /> */}

        </Routes>
    )
}

export default AppRoutes;