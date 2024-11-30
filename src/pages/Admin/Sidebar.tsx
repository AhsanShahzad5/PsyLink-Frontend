import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaUser, FaSignOutAlt,  FaFileAlt, FaCalendarAlt, FaCommentAlt, FaMoneyBill, FaBrain } from 'react-icons/fa';
import PsyLink_Logo from '/Psylink_Logo.png'; 
import useLogout from '@/hooks/useLogoutUser';
interface SidebarProps {
    setActivePage: React.Dispatch<React.SetStateAction<string>>;
}

const Sidebar: React.FC<SidebarProps> = ({ setActivePage }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const isActive = (path: string) => location.pathname.startsWith(path);
    const logout = useLogout() ;

    const handleAdminLogout = async ()=>{
        await logout();
        navigate('/admin/login');
    }
    useEffect(() => {
        const pathMap: { [key: string]: string } = {
            '/admin/dashboard': 'Dashboard',
            '/admin/settings': 'Settings',
            '/admin/patients': 'Patients',
            '/admin/doctors': 'Doctors',
            '/admin/sessions': 'Sessions',
            '/admin/complaints': 'Complaints',
            '/admin/reports': 'Reports',
            '/admin/payments': 'Payments',
            '/admin/psync': 'Psync',
        };
    
        // Find the first path that matches the start of the current location
        const activePageName = Object.entries(pathMap).find(([path]) => location.pathname.startsWith(path))?.[1];
    
        // If a match is found, set the active page; otherwise, default to "Dashboard"
        setActivePage(activePageName || 'Dashboard');
    }, [location.pathname, setActivePage]);
    

    return (
        <div className="w-64 h-screen bg-white p-4 shadow-md flex flex-col justify-between">
            {/* Logo and Title */}
            <div className="flex items-center mb-6">
                <img src={PsyLink_Logo} className="w-8 h-8" alt="Logo" />
                <h2 className="text-xl cute-font text-primary ml-2">PsyLink</h2>
            </div>

            {/* Admin Info */}
            <div className="flex flex-col mb-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase">Admin</h3>
                <h3 className="text-sm font-bold text-gray-800">Abbad Malik</h3>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col space-y-2">
                <Link
                    to="/admin/dashboard"
                    className={`flex items-center py-2 px-3 rounded-md text-sm ${
                        isActive('/admin/dashboard') ? 'bg-primary text-white' : 'text-gray-600'
                    } hover:bg-primary hover:text-white group`}
                >
                    <FaHome className={`w-4 h-4 mr-2 ${isActive('/admin/dashboard') ? 'text-white' : 'text-[#B1B1B1]'} group-hover:text-white`} />
                    Dashboard
                </Link>
               
                <Link
                    to="/admin/patients"
                    className={`flex items-center py-2 px-3 rounded-md text-sm ${
                        isActive('/admin/patients') ? 'bg-primary text-white' : 'text-gray-600'
                    } hover:bg-primary hover:text-white group`}
                >
                    <FaUser className={`w-4 h-4 mr-2 ${isActive('/admin/patients') ? 'text-white' : 'text-[#B1B1B1]'} group-hover:text-white`} />
                    Patients
                </Link>
                <Link
                    to="/admin/doctors"
                    className={`flex items-center py-2 px-3 rounded-md text-sm ${
                        isActive('/admin/doctors') ? 'bg-primary text-white' : 'text-gray-600'
                    } hover:bg-primary hover:text-white group`}
                >
                    <FaUser className={`w-4 h-4 mr-2 ${isActive('/admin/doctors') ? 'text-white' : 'text-[#B1B1B1]'} group-hover:text-white`} />
                    Doctors
                </Link>
                <Link
                    to="/admin/sessions"
                    className={`flex items-center py-2 px-3 rounded-md text-sm ${
                        isActive('/admin/sessions') ? 'bg-primary text-white' : 'text-gray-600'
                    } hover:bg-primary hover:text-white group`}
                >
                    <FaCalendarAlt className={`w-4 h-4 mr-2 ${isActive('/admin/sessions') ? 'text-white' : 'text-[#B1B1B1]'} group-hover:text-white`} />
                    Sessions
                </Link>
                <Link
                    to="/admin/complaints"
                    className={`flex items-center py-2 px-3 rounded-md text-sm ${
                        isActive('/admin/complaints') ? 'bg-primary text-white' : 'text-gray-600'
                    } hover:bg-primary hover:text-white group`}
                >
                    <FaCommentAlt className={`w-4 h-4 mr-2 ${isActive('/admin/complaints') ? 'text-white' : 'text-[#B1B1B1]'} group-hover:text-white`} />
                    Complaints
                </Link>
                <Link
                    to="/admin/reports"
                    className={`flex items-center py-2 px-3 rounded-md text-sm ${
                        isActive('/admin/reports') ? 'bg-primary text-white' : 'text-gray-600'
                    } hover:bg-primary hover:text-white group`}
                >
                    <FaFileAlt className={`w-4 h-4 mr-2 ${isActive('/admin/reports') ? 'text-white' : 'text-[#B1B1B1]'} group-hover:text-white`} />
                    Reports
                </Link>
                <Link
                    to="/admin/payments"
                    className={`flex items-center py-2 px-3 rounded-md text-sm ${
                        isActive('/admin/payments') ? 'bg-primary text-white' : 'text-gray-600'
                    } hover:bg-primary hover:text-white group`}
                >
                    <FaMoneyBill className={`w-4 h-4 mr-2 ${isActive('/admin/payments') ? 'text-white' : 'text-[#B1B1B1]'} group-hover:text-white`} />
                    Payments
                </Link>
                <Link
                    to="/admin/psync"
                    className={`flex items-center py-2 px-3 rounded-md text-sm ${
                        isActive('/admin/psync') ? 'bg-primary text-white' : 'text-gray-600'
                    } hover:bg-primary hover:text-white group`}
                >
                    <FaBrain className={`w-4 h-4 mr-2 ${isActive('/admin/psync') ? 'text-white' : 'text-[#B1B1B1]'} group-hover:text-white`} />
                    Psync
                </Link>
            </div>

            {/* Logout Button */}
            <button
                className="text-gray-600 flex items-center py-2 px-3 mt-4 rounded-md text-sm hover:bg-primary hover:text-white group"
                onClick={handleAdminLogout}
            >
                <FaSignOutAlt className="w-4 h-4 mr-2 text-[#B1B1B1] group-hover:text-white" />
                Logout
            </button>
        </div>
    );
};

export default Sidebar;
