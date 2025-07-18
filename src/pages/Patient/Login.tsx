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
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
    
    setIsLoading(true); // Set loading to true when login starts
    
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
      }
      // Store authentication data first
      localStorage.setItem('psylink', JSON.stringify(data));
      dispatch(setUser(data));
      setUser1(data);
      
      // Check profile completion status and redirect accordingly
      if (!data.profileCompleted) {
        // If profile is not complete, redirect to the details form
        if (formData.role.toLowerCase() === 'patient') {
          navigate('/patient/detailForm');
        } else if (formData.role.toLowerCase() === 'doctor') {
          navigate('/doctor/detailForm');
        } else {
          // For admin or other roles that don't need profile completion
          navigate(`/${formData.role}/home`);
        }
      } else {
        // Profile is complete, go to home page
        navigate(`/${formData.role}/home`);
      }
    } catch (error) {
      setError("An error occurred while logging in. Please try again.");
      console.log("Error signing up:", error);
    } finally {
      setIsLoading(false); // Set loading to false when login completes or fails
    }
  };

  const { email, password } = formData;


  return (
    <div className="flex justify-center min-h-screen bg-transparent border-2">
      <div className="flex flex-col md:flex-row w-full max-w-7xl rounded-lg overflow-hidden bg-white border-2">
        
        {/* Left Section - Form */}
        <div className="flex flex-col w-full lg:w-1/2 p-6 sm:p-8 lg:p-12">
          <div className="flex flex-col items-center">
            <div className="flex items-center mb-6">
              <img src="/src/assets/patient/homepage/Logo.png" alt="Logo" className="w-8 h-8 sm:w-10 sm:h-10 mr-3" />
              <h1 className="text-2xl sm:text-3xl font-semibold text-[#000]">PsyLink</h1>
            </div>
          </div>
  
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 sm:mt-8 mb-6 sm:mb-8 mx-4 sm:mx-8 lg:mx-20 gap-4 sm:gap-0">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-600">Login</h2>
            <div className="flex items-center bg-gray-200 rounded-xl">
              <div className="flex items-center gap-1">
                <button
                  className={`px-3 sm:px-5 py-2 text-xs sm:text-sm font-medium rounded-l-md focus:outline-none 
                    ${formData.role === "doctor" ? "bg-primary text-white" : "bg-gray-200 text-gray-700"}`}
                  onClick={() => setFormData({ ...formData, role: 'doctor' })}
                >
                  Doctor
                </button>
                <button
                  className={`px-3 sm:px-5 py-2 text-xs sm:text-sm font-medium rounded-r-md focus:outline-none 
                    ${formData.role === "patient" ? "bg-primary text-white" : "bg-gray-200 text-gray-700"}`}
                  onClick={() => setFormData({ ...formData, role: 'patient' })}
                >
                  Patient
                </button>
              </div>
            </div>
          </div>
  
          <div className="flex flex-col space-y-6 mx-4 sm:mx-8 lg:mx-20">
            
            <div className="flex flex-col">
              <label className="text-left font-semibold text-sm sm:text-base">Email</label>
              <input
                type="email"
                placeholder="Email"
                name="email"
                onChange={onChangeFunction}
                value={email}
                className="px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#02968A]"
              />
              {error && <p className="text-red-500 text-xs sm:text-sm">{error}</p>}
            </div>
            
            <div className="flex flex-col">
              <label className="text-left font-semibold text-sm sm:text-base">Password</label>
              <input
                type="password"
                placeholder="Password"
                name="password"
                onChange={onChangeFunction}
                value={password}
                className="px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#02968A]"
              />
              {error && <p className="text-red-500 text-xs sm:text-sm">{error}</p>}
              <p
                className="text-left text-primary underline hover:font-extrabold cursor-pointer flex justify-end mt-[4px] text-xs sm:text-sm"
                onClick={() => navigate('/forgot-password')}
              >
                Forgot Password
              </p>
            </div>
  
            <div className="flex mt-8 sm:mt-10 justify-center items-center">
              <div className="w-full sm:w-96">
                <button
                 className="w-full px-5 py-3 text-lg text-[#000] bg-[#D9D9D9] rounded-md hover:bg-[#02968A] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#02968A] disabled:opacity-70 disabled:cursor-not-allowed"
                  onClick={handleLogin}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Logging in...
                    </div>
                  ) : (
                    "Login"
                  )}
                </button>
                <p className="text-left mt-2">
                  Didn't have an account? <a className="text-blue-500 underline hover:text-blue-700" href="/sign-up">SignUp</a>
                </p>
              </div>
            </div>
          </div>
  
          {/* google login removed for now */}
          {/* <div className="flex mt-10 justify-center items-center">
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
          </div> */}
        </div>
  
        {/* Right Section - Image */}
        <div className="w-full sm:w-1/2 relative hidden md:block">
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

  // old
//   return (
//     <div className=" flex justify-center min-h-screen bg-transparent border-2 ">
//       <div className="flex w-full max-w-7xl  rounded-lg overflow-hidden bg-white border-2 ">
//         <div className="flex flex-col w-1/2 p-12">
//           <div className="flex flex-col items-center">
//             <div className="flex items-center mb-6">
//               <img src="/src/assets/patient/homepage/Logo.png" alt="Logo" className="w-10 h-10 mr-3" />
//               <h1 className="text-3xl font-semibold text-[#000]">PsyLink</h1>
//             </div>
//           </div>

//           <div className="flex justify-between items-center mt-8 mb-8 mx-20">
//             <h2 className="text-2xl font-semibold text-gray-600">Login</h2>
//             <div className="flex items-center bg-gray-200 rounded-xl">
//               <div className="flex items-center gap-1">
//                 <button
//                   className={`px-5 py-2 text-sm font-medium rounded-l-md focus:outline-none 
//                     ${formData.role === "doctor" ? "bg-primary text-white" : "bg-gray-200 text-gray-700"}`}
//                   onClick={() => setFormData({ ...formData, role: 'doctor' })}
//                 >
//                   Doctor
//                 </button>
//                 <button
//                   className={`px-5 py-2 text-sm font-medium rounded-r-md focus:outline-none 
//                     ${formData.role === "patient" ? "bg-primary text-white" : "bg-gray-200 text-gray-700"}`}
//                   onClick={() => setFormData({ ...formData, role: 'patient' })}
//                 >
//                   Patient
//                 </button>
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-col space-y-6 mx-20">
            
//             <div className="flex flex-col">
//               <label className="text-left font-semibold">Email</label>
//               <input
//                 type="email"
//                 placeholder="Email"
//                 name="email"
//                 onChange={onChangeFunction}
//                 value={email}
//                 className="px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#02968A]"
//               />
//               {error && <p className="text-red-500 text-sm">{error}</p>}
//             </div>
//             <div className="flex flex-col">
//               <label className="text-left font-semibold">Password</label>
//               <input
//                 type="password"
//                 placeholder="Password"
//                 name="password"
//                 onChange={onChangeFunction}
//                 value={password}
//                 className="px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#02968A]"
//               />
//               {error && <p className="text-red-500 text-sm">{error}</p>}
//               <p
//                 className="text-left text-primary underline hover:font-extrabold cursor-pointer flex justify-end mt-[4px]"
//                 onClick={() => navigate('/forgot-password')}
//               >
//                 Forgot Password
//               </p>
//             </div>

//             <div className="flex mt-10 justify-center items-center">
//               <div className="w-96">
//                 <button
//                   className="w-full px-5 py-3 text-lg text-[#000] bg-[#D9D9D9] rounded-md hover:bg-[#02968A] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#02968A] disabled:opacity-70 disabled:cursor-not-allowed"
//                   onClick={handleLogin}
//                   disabled={isLoading}
//                 >
//                   {isLoading ? (
//                     <div className="flex items-center justify-center">
//                       <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Logging in...
//                     </div>
//                   ) : (
//                     "Login"
//                   )}
//                 </button>
//                 <p className="text-left">
//                   Didn't have an account? <a className="text-blue-500 underline hover:text-blue-700" href="/sign-up">SignUp</a>
//                 </p>
//               </div>
//             </div>
//           </div>


// {/* google login removed for now */}

//           {/* <div className="flex mt-10 justify-center items-center">
//             <div className="w-96 flex items-center justify-center">
//               <button className="w-full px-5 py-3 flex items-center justify-center gap-3 text-lg text-[#000] bg-[#fff] border border-gray-300 rounded-md hover:bg-[#02968A] focus:outline-none focus:ring-2 focus:ring-[#02968A]">
//                 <img
//                   src="/src/assets/Login/googleIcon.png"
//                   alt="Google Logo"
//                   className="w-6 h-6"
//                 />
//                 <span className="text-sm font-medium text-gray-700">
//                   Sign in with Google
//                 </span>
//               </button>
//             </div>
//           </div> */}
//         </div>

//         <div className="w-1/2 relative hidden sm:block">
//           <div className="absolute inset-0 bg-[#02968A] hidden sm:block"></div>
//           <div className="relative flex justify-center items-center h-full bg-transparent">
//             <img
//               src="/src/assets/Login/LoginImage.png"
//               alt="Doctor and Patient"
//               className="w-4/6 h-5/6 rounded-lg shadow-md hidden sm:block"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
};

export default LoginPage;