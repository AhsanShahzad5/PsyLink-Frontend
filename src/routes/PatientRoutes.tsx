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
import ProgramsPage from '../pages/Patient/Programs';
import ExploreDoctor from '../pages/Patient/Bookings';
import { Route } from 'react-router-dom';
import Files from '@/pages/Patient/Files';


const PatientRoutes = () => (
    <>
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
    </>
);

export default PatientRoutes;
