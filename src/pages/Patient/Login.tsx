import userAtom from "@/atoms/userAtom";
import { UserCredentials } from "@/types/User";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { setUser } from './../../slices/authSlice';

const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<UserCredentials>({
    email: '',
    password: '',
    role: 'patient',
    name: ""
  });

  const [error, setError] = useState<string | null>(null);
  const setUser1 = useSetRecoilState(userAtom);

  const onChangeFunction = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError("Email is required.");
      return false;
    }
    if (!formData.password.trim()) {
      setError("Password is required.");
      return false;
    }
    setError(null); // Clear any previous error
    return true;
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const res = await fetch('http://localhost:8000/api/user/login', {
        method: "POST",
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      const data = await res.json();

      if (data.error) {
        setError("Incorrect email or password.");
        console.error(data.error);
        return;
      } else {
        navigate(`/${formData.role}/home`);
      }

      localStorage.setItem('psylink', JSON.stringify(data));
      dispatch(setUser(data));
      setUser1(data);

    } catch (error) {
      setError("An error occurred while logging in. Please try again.");
      console.log("Error signing up:", error);
    }
  };

  const { email, password } = formData;

  return (
    <div className="flex justify-center items-center min-h-screen bg-transparent">
      <div className="flex w-full max-w-7xl shadow-2xl rounded-lg overflow-hidden bg-white">
        <div className="flex flex-col w-1/2 p-12">
          <div className="flex flex-col items-center">
            <div className="flex items-center mb-6">
              <img src="/src/assets/patient/homepage/Logo.png" alt="Logo" className="w-10 h-10 mr-3" />
              <h1 className="text-3xl font-semibold text-[#000]">PsyLink</h1>
            </div>
          </div>

          <div className="flex justify-between items-center mt-8 mb-8 mx-20">
            <h2 className="text-2xl font-semibold text-gray-600">Login</h2>
            <div className="flex items-center bg-gray-200 rounded-xl">
              <div className="flex items-center gap-1">
                <button
                  className={`px-5 py-2 text-sm font-medium rounded-l-md focus:outline-none 
                    ${formData.role === "doctor" ? "bg-primary text-white" : "bg-gray-200 text-gray-700"}`}
                  onClick={() => setFormData({ ...formData, role: 'doctor' })}
                >
                  Doctor
                </button>
                <button
                  className={`px-5 py-2 text-sm font-medium rounded-r-md focus:outline-none 
                    ${formData.role === "patient" ? "bg-primary text-white" : "bg-gray-200 text-gray-700"}`}
                  onClick={() => setFormData({ ...formData, role: 'patient' })}
                >
                  Patient
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-6 mx-20">
            
            <div className="flex flex-col">
              <label className="text-left font-semibold">Email</label>
              <input
                type="email"
                placeholder="Email"
                name="email"
                onChange={onChangeFunction}
                value={email}
                className="px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#02968A]"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
            <div className="flex flex-col">
              <label className="text-left font-semibold">Password</label>
              <input
                type="password"
                placeholder="Password"
                name="password"
                onChange={onChangeFunction}
                value={password}
                className="px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#02968A]"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <p
                className="text-left text-primary underline hover:font-extrabold cursor-pointer flex justify-end mt-[4px]"
                onClick={() => navigate('/forgot-password')}
              >
                Forgot Password
              </p>
            </div>

            <div className="flex mt-10 justify-center items-center">
              <div className="w-96">
                <button
                  className="w-full px-5 py-3 text-lg text-[#000] bg-[#D9D9D9] rounded-md hover:bg-[#02968A] focus:outline-none focus:ring-2 focus:ring-[#02968A]"
                  onClick={handleLogin}
                >
                  Login
                </button>
                <p className="text-left">
                  Didn't have an account? <a className="text-blue-500 underline hover:text-blue-700" href="/sign-up">SignUp</a>
                </p>
              </div>
            </div>
          </div>

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

        <div className="w-1/2 relative">
          <div className="absolute inset-0 bg-[#02968A]"></div>
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
