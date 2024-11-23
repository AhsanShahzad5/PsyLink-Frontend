import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUser, FaSignOutAlt,  FaFileAlt, FaCalendarAlt, FaCommentAlt, FaMoneyBill, FaBrain } from 'react-icons/fa';

interface SidebarProps {
    setActivePage: React.Dispatch<React.SetStateAction<string>>;
}

const Sidebar: React.FC<SidebarProps> = ({ setActivePage }) => {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    useEffect(() => {
        switch (location.pathname) {
            case '/admin/dashboard':
                setActivePage('Dashboard');
                break;
            case '/admin/settings':
                setActivePage('Settings');
                break;
            case '/admin/patients':
                setActivePage('Patients');
                break;
            case '/admin/doctors':
                setActivePage('Doctors');
                break;
            case '/admin/sessions':
                setActivePage('Sessions');
                break;
            case '/admin/complaints':
                setActivePage('Complaints');
                break;
            case '/admin/reports':
                setActivePage('Reports');
                break;
            case '/admin/payments':
                setActivePage('Payments');
                break;
            case '/admin/psync':
                setActivePage('Psync');
                break;
            default:
                setActivePage('Dashboard');
        }
    }, [location.pathname, setActivePage]);

    return (
        <div className="w-64 h-screen bg-white p-4 shadow-md flex flex-col justify-between">
            {/* Logo and Title */}
            <div className="flex items-center mb-6">
                <img src="/FooBeesLogo.png" className="w-8 h-8" alt="Logo" />
                <h2 className="text-xl cute-font text-primary ml-2">FooBees</h2>
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
            >
                <FaSignOutAlt className="w-4 h-4 mr-2 text-[#B1B1B1] group-hover:text-white" />
                Logout
            </button>
        </div>
    );
};

export default Sidebar;
