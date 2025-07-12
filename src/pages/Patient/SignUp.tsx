import userAtom from "@/atoms/userAtom";
import { UserCredentials } from "@/types/User";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { setUser } from './../../slices/authSlice';
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUp: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UserCredentials>({
    name: "",
    email: "",
    password: "",
    role: "patient",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const setUser1 = useSetRecoilState(userAtom);

  const onChangeFunction = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error for this field
  };

  const validateInputs = () => {
    const newErrors: Record<string, string> = {};
    const { name, email, password, role } = formData;

    if (!name) newErrors.name = "Name is required.";
    else if (name.length < 4) newErrors.name = "Name must be at least 4 characters long.";
    else if (name.length > 30) newErrors.name = "Name cannot exceed 30 characters.";

    if (!email) newErrors.email = "Email is required.";
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) newErrors.email = "Invalid email format.";

    if (!password) newErrors.password = "Password is required.";
    else if (password.length < 8) newErrors.password = "Password must be at least 8 characters long.";
    else if (!/[a-zA-Z]/.test(password)) newErrors.password = "Password must include at least one letter.";

    if (!formData.role) newErrors.role = "Please select a role.";

    return newErrors;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateInputs();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      const data = await res.json();

      if (data.error) {
        console.error(data.error);
        setErrors({ form: data.error });
        toast.error(data.error || "Signup failed. Please try again.", {
          position: "bottom-right",
          autoClose: 3000,
          theme: "colored",
        });
        setLoading(false);
        return;
      } else {
        toast.success("Signup successful! Redirecting to login...", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
        
        localStorage.setItem("psylink", JSON.stringify(data));
        setUser1(data);
        dispatch(setUser(data));
        
        // Set timeout before navigating
        setTimeout(() => {
          navigate(`/login`);
        }, 3000);
      }
    } catch (error) {
      console.log("Error signing up", error);
      toast.error("An error occurred. Please try again later.", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "colored",
      });
      setLoading(false);
    }
  };

  const { name, email, password, role } = formData;

  return (
    <div className="flex justify-center items-center min-h-screen bg-transparent">
      <div className="flex w-full max-w-7xl shadow-2xl rounded-lg overflow-hidden bg-white">
        <div className="flex flex-col w-1/2 p-12">
          <div className="flex flex-col items-center">
            <div className="flex items-center mb-6">
              <img
                src="/src/assets/patient/homepage/Logo.png"
                alt="Logo"
                className="w-10 h-10 mr-3"
              />
              <h1 className="text-3xl font-semibold text-[#000]">PsyLink</h1>
            </div>
          </div>

          <div className="flex justify-between items-center mt-8 mb-8 mx-20">
            <h2 className="text-2xl font-semibold text-gray-600">Signup</h2>
            <div className="flex items-center bg-gray-200 rounded-xl">
              <div className="flex items-center gap-1">
                <button
                  className={`px-5 py-2 text-sm font-medium rounded-l-md focus:outline-none ${
                    formData.role === "doctor"
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setFormData({ ...formData, role: "doctor" })}
                >
                  Doctor
                </button>
                <button
                  className={`px-5 py-2 text-sm font-medium rounded-r-md focus:outline-none   ${
                    formData.role === "patient"
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setFormData({ ...formData, role: "patient" })}
                >
                  Patient
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-6 mx-20">
            <div className="flex flex-col">
              <label className="text-left font-semibold">Full Name</label>
              <input
                placeholder="Enter your full name"
                name="name"
                onChange={onChangeFunction}
                value={name}
                className="px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#02968A]"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>
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
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
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
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            <div className="flex mt-10 justify-center items-center">
              <div className="w-96">
                <button
                  className="w-full px-5 py-3 text-lg text-[#000] bg-[#D9D9D9] rounded-md hover:bg-[#02968A] hover:text-white focus:bg-[#02968A] focus:text-white"
                  onClick={handleSignup}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Sign Up"
                  )}
                </button>
                <p className="text-left">
                  Already have an account?{" "}
                  <a
                    className="text-blue-500 underline hover:text-blue-700"
                    href="/login"
                  >
                    Login
                  </a>
                </p>
              </div>
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
      
      {/* Toast Container */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default SignUp;