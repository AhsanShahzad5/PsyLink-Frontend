import { AdminCredentials } from "@/types/User";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AdminCredentials>({
    username: '',
    password: '',
    role: 'admin'
  })


  const onChangeFunction = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    console.log(formData);
    setFormData({
      username: '',
      password: '',
      role: 'admin'
    })

    navigate('/admin/dashboard')
    
  }


  const { username, password } = formData;

  return (
    <div className="flex justify-center items-center h-screen bg-secondary">
      <div className="bg-white w-3/4 max-w-3/4 h-auto p-6 rounded-lg border-2 shadow-lg">
        <div className="flex flex-col items-center mb-6">
          <img
            src="/Psylink_Logo.png"
            alt="Psylink Logo"
            className="w-14 m-0 "
          />
          <h1 className="text-primary m-0 font-bold  text-xl">PsyLink</h1>
        </div>
        <h2 className="text-md font-semibold text-gray-800  text-center mb-6">
          Admin Login
        </h2>
        <form className="flex flex-col h-full">
          <div className="mb-4 items-center">
            <label
              htmlFor="username"
              className="block  max-w-xl  text-xs font-medium text-gray-700 "
            >
              Username
            </label>
            <input

              id="username"
              placeholder="Enter username"
              name='username'
              onChange={onChangeFunction}
              value={username}
              className="w-full max-w-sm mt-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-[#088178] focus:border-[#088178] mx-auto"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"

              className="block text-xs ml-3 max-w-xl  font-medium text-gray-700 "
            >
              PASSWORD
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              name='password'
              onChange={onChangeFunction}
              value={password}
              id="password"
              className="w-full max-w-sm mt-1 px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-[#088178] focus:border-[#088178] mx-auto"
            />
          </div>
          <div className=" mx-auto mt-16 w-1/12">
            <button
              type="submit"
              className="w-full max-w-sm bg-primary text-white py-2 px-4 rounded-lg hover:bg-[#0b706b] transition-colors text-sm mx-auto"
              onClick ={handleLogin}
              >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
