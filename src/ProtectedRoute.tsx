import { Navigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import userAtom from './atoms/userAtom';

const ProtectedRoute = ({ children, allowedRoles }: any) => {
    const user = useRecoilValue(userAtom);
    
    if (!user) {
        // Redirect to login if no user is logged in
        return <Navigate to="/login" />;
    }
    
    // Automatically allow admins to access any protected route
    if (user.role === 'admin' || allowedRoles.includes(user.role)) {
        return children;
    }
    
    // Redirect to the login page if the user role is not allowed
    return <Navigate to="/login" />;
};

export default ProtectedRoute;