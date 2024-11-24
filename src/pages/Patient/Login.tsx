import React from "react";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {

    const navigate = useNavigate();
  return (
    <div className="flex justify-center items-center min-h-screen bg-transparent">
      {/* Main container */}
      <div className="flex w-full max-w-7xl shadow-2xl rounded-lg overflow-hidden bg-white">
        {/* Left Section */}
        <div className="flex flex-col w-1/2 p-12">
          {/* Logo and Text */}
          <div className="flex flex-col items-center">
            <div className="flex items-center mb-6">
              <img src="/src/assets/patient/homepage/Logo.png" alt="Logo" className="w-10 h-10 mr-3" />
              <h1 className="text-3xl font-semibold text-[#000]">PsyLink</h1>
            </div>
          </div>

          {/* Login Text and Slider */}
          <div className="flex justify-between items-center mt-8 mb-8 mx-20">
            <h2 className="text-2xl font-semibold text-gray-600">Login</h2>
            <div className="flex items-center bg-gray-200 rounded-xl">
            <div className="flex items-center gap-1">
              <button
                className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#02968A]"
              >
                Doctor
              </button>
              <button
                className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-r-md focus:outline-none focus:ring-2 focus:ring-[#02968A]"
              >
                Patient
              </button>
            </div>
            </div>
          </div>

          {/* Input Fields */}
          <div className="flex flex-col space-y-6 mx-20">
            <div className="flex flex-col">
            <label className="text-left font-semibold">Email</label>
            <input
              type="email"
              placeholder="Email"
              className="px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#02968A]"
            />
            </div>
            <div className="flex flex-col">
            <label className="text-left font-semibold">Password</label>
            <input
              type="password"
              placeholder="Password"
              className="px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#02968A]"
            />
            </div>


            <div className="flex mt-10 justify-center items-center">
                <div className="w-96">
                    <button
                        className="w-full px-5 py-3 text-lg text-[#000] bg-[#D9D9D9] rounded-md hover:bg-[#02968A] focus:outline-none focus:ring-2 focus:ring-[#02968A]"
                        onClick={()=> navigate('/patient/Home')}
                    >
                    Login
                    </button>
                    <p className="text-left">Didn't have an account? <a className="text-blue-500 underline hover:text-blue-700" href="/sign-up" >SignUp</a> </p>
                </div>
            </div>


          </div>

          {/* Google Sign-In */}
          <div className="flex mt-10 justify-center items-center">
  <div className="w-96 flex items-center justify-center">
    <button className="w-full px-5 py-3 flex items-center justify-center gap-3 text-lg text-[#000] bg-[#fff] border border-gray-300 rounded-md hover:bg-[#02968A] focus:outline-none focus:ring-2 focus:ring-[#02968A]">
      <img
        src="/src/assets/Login/googleIcon.png"
        alt="Google Logo"
        className="w-6 h-6"
      />
      <span className="text-sm font-medium text-gray-700">
        Sign in with Google
      </span>
    </button>
  </div>
</div>
        </div>

        {/* Right Section */}
        <div className="w-1/2 relative">
          {/* Background */}
          <div className="absolute inset-0 bg-[#02968A]"></div>
          {/* Image */}
          <div className="relative flex justify-center items-center h-full bg-transparent">
            <img
              src="/src/assets/Login/LoginImage.png"
              alt="Doctor and Patient"
              className="w-4/6 h-5/6 rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
