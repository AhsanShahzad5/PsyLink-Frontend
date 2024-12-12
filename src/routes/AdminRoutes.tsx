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
import ProtectedRoute from '@/ProtectedRoute';
import { Route } from 'react-router-dom';

const AdminRoutes = () => (
    <>
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
    </>
);

export default AdminRoutes;
