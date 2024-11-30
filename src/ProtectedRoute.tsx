
import { Navigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import userAtom from './atoms/userAtom';

const ProtectedRoute = ({ children, allowedRoles }:any) => {
    const user = useRecoilValue(userAtom);

    if (!user) {
        // Redirect to login if no user is logged in
        return <Navigate to= "/login" />;
        
        
    }

    if (!allowedRoles.includes(user.role)) {
        // Redirect to the home page if the user role is not allowed
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;
