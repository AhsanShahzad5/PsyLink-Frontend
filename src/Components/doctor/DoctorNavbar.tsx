import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import NavbarSideUserProfileMenu from '../NavbarSideUserProfileMenu';

export default function Navbar() {

  const [activeNav, setActiveNav] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.split("/")[2]; // Extract the last part of the URL
    const active = path ? path.charAt(0).toUpperCase() + path.slice(1) : "Home";
    setActiveNav(active);
  }, [location]);
  
  const handleNavClick = (link: any) => {
    setActiveNav(link);
    const lowercaseLink = link.charAt(0).toLowerCase() + link.slice(1);
    navigate(`/doctor/${lowercaseLink}`);
  }

  return (
    <div>
      {/* Navbar */}
      <nav className="flex justify-between items-center w-full p-2 bg-white shadow-md fixed top-0 left-0 right-0 z-10">
        {/* Logo Section */}
        <div className="flex items-center space-x-2 cursor-pointer" onClick={()=>navigate('/doctor/home')}>
          <img src="/Psylink_Logo.png" alt="Logo" className="h-9" />
          <span className="text-[22.5px] font-semibold cursor-pointer">PsyLink</span>
        </div>

        {/* Toggle Button for Small Screens */}
        <div className="md:hidden">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-3xl">
            ☰
          </button>
        </div>

        {/* Navigation Links for Large Screens */}
        <div className="hidden md:flex space-x-1  text-center items-center justify-items-center border-4 rounded-full px-4 gap-x-12 mr-20 text-xl font-semibold">
          {["Home", "Appointments", "Clinic", "Psync"].map((link) => (
            <button
              key={link}
              onClick={() => handleNavClick(link)}
              className={`px-4 py-2 rounded-full ${activeNav === link ? "bg-[#02968A] text-white" : "text-black bg-transparent"
                } transition-all duration-300 ease-in-out flex justify-center items-center min-w-[120px]`}
            >
              {link}
            </button>
          ))}
        </div>

        {/* User Profile Icon */}
        <NavbarSideUserProfileMenu />
      </nav>

      {/* Sidebar for Small Screens */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setIsSidebarOpen(false)}>
          <div
            className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg flex flex-col p-6 space-y-6 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button className="self-end text-2xl font-bold" onClick={() => setIsSidebarOpen(false)}>
              ×
            </button>
            <div className="flex flex-col space-y-6 text-lg font-semibold">
              {["Home", "Appointments", "Clinic", "Psync"].map((link) => (
                <button
                  key={link}
                  onClick={() => {
                    setIsSidebarOpen(false);
                    handleNavClick(link);

                  }}
                  className={`${activeNav === link ? "text-primary" : "text-black"
                    }`}
                >
                  {link}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
