import  { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function Navbar() {

    const [activeNav, setActiveNav] = useState("Home");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const handleNavClick = (link:any) => {
        navigate(`/patient/${link}`);
        setActiveNav(link);
        
    }

  return (
    <div>
         {/* Navbar */}
       <nav className="flex justify-between items-center w-full p-4 bg-white shadow-md fixed top-0 left-0 right-0 z-10">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <img src="/src/assets/patient/homepage/Logo.png" alt="Logo" className="h-12" />
          <span className="text-2xl font-semibold">PsyLink</span>
        </div>

        {/* Toggle Button for Small Screens */}
        <div className="md:hidden">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-3xl">
            ☰
          </button>
        </div>

        {/* Navigation Links for Large Screens */}
        <div className="hidden md:flex space-x-2 text-lg text-center items-center justify-items-center font-semibold border-4 rounded-full px-4 gap-x-12">
            {["Home", "Bookings", "Allen", "Psync", "Programs"].map((link) => (
                <button
                key={link}
                onClick={() => handleNavClick(link)}
                className={`px-4 py-2 rounded-full ${
                    activeNav === link ? "bg-[#02968A] text-white" : "text-black bg-transparent"
                } ${link === "Allen" ? "bg-gradient-to-b from-[#9E00CA] to-[#4F0064] text-white" : ""}
                transition-all duration-300 ease-in-out flex justify-center items-center min-w-[120px]`}
                >
                {link}
                </button>
            ))}
        </div>

        {/* User Profile Icon */}
        <div className="hidden md:block">
          <img src="/src/assets/patient/homepage/Vector.png" alt="User" className="h-10 w-10 rounded-full object-contain" />
        </div>
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
              {["Home", "Bookings", "Allen", "Psync", "Programs"].map((link) => (
                <a
                  key={link}
                  href=''
                  onClick={() => {
                    setIsSidebarOpen(false);
                    handleNavClick(link);

                  }}
                  className={`${
                    activeNav === link ? "text-[#319F43]" : "text-black"
                  } ${link === "Allen" ? "bg-gradient-to-b from-[#9E00CA] to-[#4F0064] rounded-full px-4 py-2 text-white" : ""}`}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
