import userAtom from "@/atoms/userAtom";
import { AdminCredentials } from "@/types/User";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AdminCredentials>({
    username: "",
    password: "",
    role: "admin",
  });

  const setUser = useSetRecoilState(userAtom);

  const onChangeFunction = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: any) => {
    // setLoading(true);
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("frontend", data);

      if (data.error) {
        // showToast("Error" ,data.error,'error' )
        console.error(data.error);

        return;
      } else {
        // showToast("success", "Logged in successfully"
        //     , 'success');

        // setFormData({
        //     username: "",
        //     password: ""
        // })

        navigate("/admin/dashboard");
      }
      // storing user data in local stoorage
      localStorage.setItem("psylink", JSON.stringify(data));
      setUser(data);
    } catch (error) {
      // showToast("Error", error, 'error')
      console.log("error signing up", error);
    } finally {
      //setLoading(false)
    }
  };

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
        <form className="flex flex-col items-center h-full w-full">
          <div className="mb-4 w-full max-w-sm">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              id="username"
              placeholder="Enter your username"
              name="username"
              onChange={onChangeFunction}
              value={username}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-150"
            />
          </div>

          <div className="mb-6 w-full max-w-sm">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              name="password"
              onChange={onChangeFunction}
              value={password}
              id="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition duration-150"
            />
          </div>

          <div className="w-full max-w-sm">
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-[#0b706b] transition-colors text-sm font-semibold"
              onClick={handleLogin}
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
