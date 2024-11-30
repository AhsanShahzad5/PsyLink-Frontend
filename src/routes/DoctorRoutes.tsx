
import { Route } from 'react-router-dom';

const DoctorRoutes = () => (
    <>
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
    </>
);

export default DoctorRoutes;
