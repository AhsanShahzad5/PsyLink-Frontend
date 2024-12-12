
import { Navigate, Route, Routes } from 'react-router-dom';

import SignUp from './pages/Patient/SignUp';
import Login from './pages/Patient/Login';
import LandingPage from './pages/Patient/landingPage';
import PrescriptionPopUp from '@/Components/patient/PrescriptionPopUp';
import PatientLayout from '@/layouts/PatientLayout';
import AIChatbotPage from '@/pages/Patient/AIChatbot';
import ChooseSpecialist from '@/pages/Patient/ChooseSpecialist';
import DetailForm from '@/pages/Patient/DetailForm';
import DoctorDetails from '@/pages/Patient/DoctorDetails';
import DoctorReviewPage from '@/pages/Patient/DoctorReview';
import ExerciseDetails from '@/pages/Patient/ExerciseDetails';
import HomePage from '@/pages/Patient/HomePage';
import NotesPage from '@/pages/Patient/NotesPage';
import Prescription from '@/pages/Patient/Prescriptions';
import ProgramDetails from '@/pages/Patient/ProgramDetails';
import VideoConsulation from '@/pages/Patient/VideoConsulation';
import PsyncHomePage from '@/pages/Psync/PsyncHomePage';
import ProtectedRoute from '@/ProtectedRoute';
import ProgramsPage from '@/pages/Patient/Programs';
import ExploreDoctor from '@/pages/Patient/Bookings';
import Files from '@/pages/Patient/Files';
import DoctorLayout from '@/layouts/DoctorLayout';
import DoctorAppointments from '@/pages/Doctor/DoctorAppointments';
import DoctorClinic from '@/pages/Doctor/DoctorClinic';
import DoctorDetailForm from '@/pages/Doctor/DoctorDetailForm';
import DoctorHome from '@/pages/Doctor/DoctorHome';
import DoctorProfessionalDetailsForm from '@/pages/Doctor/DoctorProfessionalDetailsForm';
import LoginPage from '@/pages/Doctor/LoginPage';
import PaymentAnalyticsDetails from '@/pages/Doctor/PaymentAnalyticsDetails';
import ThankYouPage from '@/pages/Doctor/ThankYouPage';
import AdminLayout from '@/layouts/AdminLayout';
import AdminLogin from '@/pages/Admin/AdminLogin';
import Complaints from '@/pages/Admin/Complaints';
import ComplaintsDetails from '@/pages/Admin/ComplaintsDetails';
import Dashboard from '@/pages/Admin/Dashboard';
import Doctors from '@/pages/Admin/Doctors';
import DoctorsDetails from '@/pages/Admin/DoctorsDetails';
import PatientDetails from '@/pages/Admin/PatientDetails';
import Patients from '@/pages/Admin/Patients';
import Payments from '@/pages/Admin/Payments';
import PaymentsDetails from '@/pages/Admin/PaymentsDetails';
import Psync from '@/pages/Admin/Psync';
import Reports from '@/pages/Admin/Reports';
import SessionDetail from '@/pages/Admin/SessionDetail';
import Sessions from '@/pages/Admin/Sessions';
import ForgotPasswordPage from './pages/Patient/ForgotPasswordPage';
import ResetPassword from './pages/Patient/ResetPasswordPage';



const AppRoutes = () => (
    <Routes>
        {/* General Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />


        {/* Patient Routes */}

        <Route
            path="/patient/detailForm"
            element={
                <ProtectedRoute allowedRoles={['patient']}>
                    <PatientLayout>
                        <DetailForm />
                    </PatientLayout>
                </ProtectedRoute>
            }
        />
        <Route
            path="/patient/chooseSpecialist"
            element={
                <ProtectedRoute allowedRoles={['patient']}>
                    <ChooseSpecialist />
                </ProtectedRoute>
            }
        />
        <Route
            path="/patient/home"
            element={
                <ProtectedRoute allowedRoles={['patient']}>
                    <PatientLayout>
                        <HomePage />
                    </PatientLayout>
                </ProtectedRoute>
            }
        />
        <Route
            path="/patient/notes"
            element={
                <ProtectedRoute allowedRoles={['patient']}>
                    <PatientLayout>
                        <NotesPage />
                    </PatientLayout>
                </ProtectedRoute>
            }
        />
        <Route
            path="/patient/history"
            element={
                <ProtectedRoute allowedRoles={['patient']}>
                    <PatientLayout>
                        <Prescription />
                    </PatientLayout>
                </ProtectedRoute>
            }
        />
        <Route
            path="/patient/program-details"
            element={
                <ProtectedRoute allowedRoles={['patient']}>
                    <PatientLayout>
                        <ProgramDetails />
                    </PatientLayout>
                </ProtectedRoute>
            }
        />
        <Route
            path="/patient/prescription"
            element={
                <ProtectedRoute allowedRoles={['patient']}>
                    <PrescriptionPopUp />
                </ProtectedRoute>
            }
        />
        <Route
            path="/patient/bookings"
            element={
                <ProtectedRoute allowedRoles={['patient']}>
                    <PatientLayout>
                        <ExploreDoctor />
                    </PatientLayout>
                </ProtectedRoute>
            }
        />
        <Route
            path="/patient/video-consultation"
            element={
                <ProtectedRoute allowedRoles={['patient']}>
                    <VideoConsulation />
                </ProtectedRoute>
            }
        />
        <Route
            path="/patient/doctor-review"
            element={
                <ProtectedRoute allowedRoles={['patient']}>
                    <PatientLayout>
                        <DoctorReviewPage />
                    </PatientLayout>
                </ProtectedRoute>
            }
        />
        <Route
            path="/patient/doctor-details"
            element={
                <ProtectedRoute allowedRoles={['patient']}>
                    <PatientLayout>
                        <DoctorDetails />
                    </PatientLayout>
                </ProtectedRoute>
            }
        />
        <Route
            path="/patient/allen"
            element={
                <ProtectedRoute allowedRoles={['patient']}>
                    <PatientLayout>
                        <AIChatbotPage />
                    </PatientLayout>
                </ProtectedRoute>
            }
        />
        <Route
            path="/patient/programs"
            element={
                <ProtectedRoute allowedRoles={['patient']}>
                    <PatientLayout>
                        <ProgramsPage />
                    </PatientLayout>
                </ProtectedRoute>
            }
        />
        <Route
            path="/patient/exercise-details"
            element={
                <ProtectedRoute allowedRoles={['patient']}>
                    <PatientLayout>
                        <ExerciseDetails />
                    </PatientLayout>
                </ProtectedRoute>
            }
        />
        <Route
            path="/patient/files"
            element={
                <ProtectedRoute allowedRoles={['patient']}>
                    <PatientLayout>
                        <Files />
                    </PatientLayout>
                </ProtectedRoute>
            }
        />
        <Route
            path="/patient/psync"
            element={
                <ProtectedRoute allowedRoles={['patient']}>
                    <PatientLayout>
                        <PsyncHomePage />
                    </PatientLayout>
                </ProtectedRoute>
            }
        />

<Route
            path="/doctor/login"
            element={<LoginPage />}
        />
        <Route
            path="/doctor/home"
            element={
                <ProtectedRoute allowedRoles={['doctor']}>
                    <DoctorLayout>
                        <DoctorHome />
                    </DoctorLayout>
                </ProtectedRoute>
            }
        />
        <Route
            path="/doctor/payment-analytics"
            element={
                <ProtectedRoute allowedRoles={['doctor']}>
                    <DoctorLayout>
                        <PaymentAnalyticsDetails />
                    </DoctorLayout>
                </ProtectedRoute>
            }
        />
        <Route
            path="/doctor/appointments"
            element={
                <ProtectedRoute allowedRoles={['doctor']}>
                    <DoctorLayout>
                        <DoctorAppointments />
                    </DoctorLayout>
                </ProtectedRoute>
            }
        />
        <Route
            path="/doctor/clinic"
            element={
                <ProtectedRoute allowedRoles={['doctor']}>
                    <DoctorLayout>
                        <DoctorClinic />
                    </DoctorLayout>
                </ProtectedRoute>
            }
        />
        <Route
            path="/doctor/detailForm"
            element={
                <ProtectedRoute allowedRoles={['doctor']}>
                    <DoctorDetailForm />
                </ProtectedRoute>
            }
        />
        <Route
            path="/doctor/professionaldetailForm"
            element={
                <ProtectedRoute allowedRoles={['doctor']}>
                    <DoctorProfessionalDetailsForm />
                </ProtectedRoute>
            }
        />
        <Route
            path="/doctor/thankyoupage"
            element={
                <ProtectedRoute allowedRoles={['doctor']}>
                    <ThankYouPage />
                </ProtectedRoute>
            }
        />
        <Route
            path="/doctor/video-consultation"
            element={
                <ProtectedRoute allowedRoles={['doctor']}>
                    <VideoConsulation />
                </ProtectedRoute>
            }
        />
        <Route
            path="/doctor/psync"
            element={
                <ProtectedRoute allowedRoles={['doctor']}>
                    <DoctorLayout>
                        <PsyncHomePage />
                    </DoctorLayout>
                </ProtectedRoute>
            }
        />


<Route path="/admin/login" element={<AdminLogin />} />
        <Route
            path="/admin/dashboard"
            element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLayout>
                        <Dashboard />
                    </AdminLayout>
                </ProtectedRoute>
            }
        />
        <Route
            path="/admin/patients"
            element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLayout>
                        <Patients />
                    </AdminLayout>
                </ProtectedRoute>
            }
        />
        <Route
            path="/admin/patients/patient-details"
            element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLayout>
                        <PatientDetails />
                    </AdminLayout>
                </ProtectedRoute>
            }
        />
        <Route
            path="/admin/doctors"
            element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLayout>
                        <Doctors />
                    </AdminLayout>
                </ProtectedRoute>
            }
        />
        <Route
            path="/admin/doctors/doctor-details"
            element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLayout>
                        <DoctorsDetails />
                    </AdminLayout>
                </ProtectedRoute>
            }
        />
        <Route
            path="/admin/sessions"
            element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLayout>
                        <Sessions />
                    </AdminLayout>
                </ProtectedRoute>
            }
        />
        <Route
            path="/admin/sessions/session-details"
            element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLayout>
                        <SessionDetail />
                    </AdminLayout>
                </ProtectedRoute>
            }
        />
        <Route
            path="/admin/complaints"
            element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLayout>
                        <Complaints />
                    </AdminLayout>
                </ProtectedRoute>
            }
        />
        <Route
            path="/admin/complaints/complaint-details"
            element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLayout>
                        <ComplaintsDetails />
                    </AdminLayout>
                </ProtectedRoute>
            }
        />
        <Route
            path="/admin/reports"
            element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLayout>
                        <Reports />
                    </AdminLayout>
                </ProtectedRoute>
            }
        />
        <Route
            path="/admin/payments"
            element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLayout>
                        <Payments />
                    </AdminLayout>
                </ProtectedRoute>
            }
        />
        <Route
            path="/admin/payments/payment-details"
            element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLayout>
                        <PaymentsDetails />
                    </AdminLayout>
                </ProtectedRoute>
            }
        />
        <Route
            path="/admin/psync"
            element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLayout>
                        <Psync />
                    </AdminLayout>
                </ProtectedRoute>
            }
        />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />

    </Routes>
);

export default AppRoutes;