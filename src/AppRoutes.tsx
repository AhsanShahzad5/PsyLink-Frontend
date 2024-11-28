import { Routes, Route, Navigate } from 'react-router-dom';
// import App from './App';
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

import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorClinic from './pages/Doctor/DoctorClinic';
import DoctorLayout from './layouts/DoctorLayout';
// import NavbarSideUserProfileMenu from './Components/NavbarSideUserProfileMenu';
import PatientLayout from './layouts/PatientLayout';
import Login from './pages/Patient/Login';
import SignUp from './pages/Patient/SignUp';

import Dashboard from './pages/Admin/Dashboard';
// import Layout from './pages/Admin/Layout';
import Patients from './pages/Admin/Patients';
import Doctors from './pages/Admin/Doctors';
import Sessions from './pages/Admin/Sessions';
import Complaints from './pages/Admin/Complaints';
import Reports from './pages/Admin/Reports';
import Payments from './pages/Admin/Payments';
import Psync from './pages/Admin/Psync';
import PatientDetails from './pages/Admin/PatientDetails';
import Files from './pages/Patient/Files';
import AdminLayout from './layouts/AdminLayout';
import PsyncHomePage from './pages/Psync/PsyncHomePage';
import DoctorsDetails from './pages/Admin/DoctorsDetails';
import SessionDetail from './pages/Admin/SessionDetail';
import ComplaintsDetails from './pages/Admin/ComplaintsDetails';
import PaymentsDetails from './pages/Admin/PaymentsDetails';
import PaymentAnalyticsDetails from './pages/Doctor/PaymentAnalyticsDetails';
// import Temp from './pages/Doctor/temp';
// import Temp2 from './pages/Doctor/temp2';

const AppRoutes = () => {

    return (
        <Routes>
            {/* general routes  */}
            {/* <Route path='/' element={<App />} /> */}
            <Route path='/' element={<LandingPage/>} />
            <Route path='*' element={<Navigate to='/' />} />

            {/* <Route path='/login' element={<LoginPage/> } /> */}
            <Route path='/login' element={<Login />} />
            <Route path='/sign-up' element={<SignUp />} />
            <Route path='/landing-page' element={<LandingPage />} />
  
  
  {/* -----------------------------------------------------PATIENT ROUTES-------------------------------------------------------------------  */}
          
            <Route path='/patient/detailForm' element={<PatientLayout> <DetailForm /> </PatientLayout>} />
            <Route path='/patient/chooseSpecialist' element={<ChooseSpecialist />} />
            <Route path='/patient/home' element={<PatientLayout><HomePage /> </PatientLayout>} />
            <Route path='/patient/notes' element={<PatientLayout> <NotesPage /> </PatientLayout>} />
            <Route path='/patient/history' element={<PatientLayout> <Prescription /> </PatientLayout>} />
            <Route path='/patient/program-details' element={<PatientLayout> <ProgramDetails /> </PatientLayout>} />
            <Route path='/patient/prescription' element={<PrescriptionPopUp />} />
            <Route path='/patient/bookings' element={<PatientLayout> <ExploreDoctor /> </PatientLayout>} />
            <Route path='/patient/video-consultation' element={<VideoConsulation />} />
            <Route path='/patient/doctor-review' element={<PatientLayout> <DoctorReviewPage /> </PatientLayout>} />
            <Route path='/patient/doctor-details' element={<PatientLayout> <DoctorDetails /> </PatientLayout>} />
            <Route path='/patient/Allen' element={<PatientLayout> <AIChatbotPage /> </PatientLayout>} />
            <Route path='/patient/Programs' element={<PatientLayout> <ProgramsPage /> </PatientLayout>} />
            <Route path='/patient/exercise-details' element={<PatientLayout> <ExerciseDetails /> </PatientLayout>} />
            <Route path='/patient/files' element={<PatientLayout> <Files /> </PatientLayout>} />
            <Route path='/patient/psync' element={<PatientLayout> <PsyncHomePage/> </PatientLayout>} />
          
  {/* -----------------------------------------------------DOCTOR ROUTES-------------------------------------------------------------------  */}
          
            <Route path='/doctor/login' element={<LoginPage />} />
            <Route path='/doctor/home' element={<DoctorLayout> <DoctorHome /> </DoctorLayout>} />
            <Route path='/doctor/payment-analytics' element={<DoctorLayout> <PaymentAnalyticsDetails/> </DoctorLayout>} />
            <Route path='/doctor/appointments' element={<DoctorLayout><DoctorAppointments /></DoctorLayout>} />
            <Route path='/doctor/clinic' element={<DoctorLayout>  <DoctorClinic />  </DoctorLayout>} />
            {/* <Route path='/doctor/psync' element={<DoctorLayout><DoctorPsync /></DoctorLayout>} /> */}

            <Route path='/doctor/detailForm' element={<DoctorDetailForm />} />
            <Route path='/doctor/professionaldetailForm' element={<DoctorProfessionalDetailsForm />} />
            <Route path='/doctor/thankyoupage' element={<ThankYouPage />} />
          
            {/* psync */}
            <Route path='/doctor/psync' element={<DoctorLayout> <PsyncHomePage/> </DoctorLayout>} />

            {/* -----------------------------------------------------ADMIN ROUTES-------------------------------------------------------------------  */}
          
            <Route path='/admin/login' element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminLayout> <Dashboard /> </AdminLayout>} />
            <Route path="/admin/patients" element={<AdminLayout> <Patients /> </AdminLayout>} />
            <Route path="/admin/patients/patient-details" element={<AdminLayout> <PatientDetails /> </AdminLayout>} />
            <Route path="/admin/doctors" element={<AdminLayout> <Doctors /> </AdminLayout>} />
            <Route path="/admin/doctors/doctor-details" element={<AdminLayout> <DoctorsDetails/> </AdminLayout>} />
            <Route path="/admin/sessions" element={<AdminLayout> <Sessions /> </AdminLayout>} />
            <Route path="/admin/sessions/session-details" element={<AdminLayout> <SessionDetail /> </AdminLayout>} />
            <Route path="/admin/complaints" element={<AdminLayout> <Complaints /> </AdminLayout>} />
            <Route path="/admin/complaints/complaint-details" element={<AdminLayout> <ComplaintsDetails /> </AdminLayout>} />
            <Route path="/admin/reports" element={<AdminLayout> <Reports /> </AdminLayout>} />
            <Route path="/admin/payments" element={<AdminLayout> <Payments /> </AdminLayout>} />
            <Route path="/admin/payments/payment-details" element={<AdminLayout> <PaymentsDetails /> </AdminLayout>} />
            <Route path="/admin/psync" element={<AdminLayout> <Psync /> </AdminLayout>} />


            {/* <Route path="/admin/settings" element={<Settings />} /> */}
            {/* </Route> */}
            {/* testing routes */}
            {/* <Route path='/test' element={<Temp2/>} /> */}

        </Routes>
    )
}

export default AppRoutes;