import userAtom from "@/atoms/userAtom";
import { UserCredentials } from "@/types/User";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<UserCredentials>({
    name: "",
    email: "",
    password: "",
    role: "patient",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const setUser = useSetRecoilState(userAtom);

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

    try {
      const res = await fetch("http://localhost:8000/api/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.error) {
        console.error(data.error);
        setErrors({ form: data.error });
        return;
      } else {
        navigate(`/login`);
      }

      localStorage.setItem("psylink", JSON.stringify(data));
      setUser(data);
    } catch (error) {
      console.log("Error signing up", error);
    }
  };

  const { name, email, password, role } = formData;

  return (
    <div className="flex justify-center items-center min-h-screen bg-transparent my-10">
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
                >
                  Sign Up
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
    </div>
  );
};

export default SignUp;
