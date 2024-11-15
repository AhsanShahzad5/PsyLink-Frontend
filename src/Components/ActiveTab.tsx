import React, { useState } from 'react';

const NavBar: React.FC = () => {
  const [activeNav, setActiveNav] = useState('Prescriptions');

  return (
    <div>
      {/* Navbar */}
      <nav className="flex justify-between items-center w-full p-4 bg-white shadow-md fixed top-0 left-0 right-0 z-10 mt-24">
        {/* Navigation Links for Large Screens */}
        <div className="flex space-x-2 text-lg text-center items-center justify-items-center font-semibold px-4 gap-x-12">
          {["Prescriptions", "Mood Progress", "Previous Programs"].map((link) => (
            <button
              key={link}
              onClick={() => setActiveNav(link)}
              className={`px-4 py-2 rounded-full text-lg font-semibold transition-all duration-300 ease-in-out flex justify-center items-center min-w-[120px] ${
                activeNav === link ? "bg-[#02968A] text-white" : "text-black bg-transparent"
              }`}
            >
              {link}
            </button>
          ))}
        </div>

        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <img src="/src/assets/homepage/Logo.png" alt="Logo" className="h-12" />
          <span className="text-2xl font-semibold">PsyLink</span>
        </div>

        {/* Toggle Button for Small Screens */}
        <div className="md:hidden">
          <button onClick={() => console.log("Toggle sidebar")} className="text-3xl">
            ☰
          </button>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
