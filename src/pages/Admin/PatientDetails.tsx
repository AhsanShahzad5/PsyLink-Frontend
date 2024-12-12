import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { Patient } from "./data/interfaces";

const PatientDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const patient = location.state?.patient as Patient; // Explicitly cast to Patient type

  if (!patient) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-semibold text-gray-600">No Patient Data Found</h1>
        <button
          className="mt-4 px-4 py-2 bg-primary text-white rounded shadow hover:bg-primaryHover"
          onClick={() => navigate("/")}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-secondary">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg h-screen  p-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <FaArrowLeft
            className="text-primary cursor-pointer hover:text-gray-800 mr-4"
            onClick={() => navigate("/admin/patients")}
            size={20}
          />
          <h1 className="text-3xl font-semibold">{patient.name}</h1>
          <div className="ml-auto flex gap-4">
            <button className="px-4 w-[100px] py-2 rounded-xl bg-primary text-white shadow hover:bg-primaryHover">
              Ban
            </button>
            <button className="px-4 py-2 w-[100px] rounded-xl bg-red-500 text-white shadow hover:bg-red-600">
              Remove
            </button>
          </div>
        </div>
        <div className="overflow-auto h-[88%] custom-scrollbar">

        
        {/* Patient Details Section */}
        <h2 className="text-xl font-semibold mb-4 text-primary text-left">Patient Details</h2>
        <div className="mb-6 border-t border-gray-200 pt-4">
          <table className="table-auto w-full text-left border-collapse">
            <tbody>
              <tr className="border-t border-gray-200">
                <td className="py-2 font-semibold text-gray-600">Email:</td>
                <td className="py-2">{patient.email}</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-2 font-semibold text-gray-600">Full Name:</td>
                <td className="py-2">{patient.name}</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-2 font-semibold text-gray-600">Age:</td>
                <td className="py-2">{patient.age}</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-2 font-semibold text-gray-600">Gender:</td>
                <td className="py-2">{patient.gender}</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-2 font-semibold text-gray-600">Disability:</td>
                <td className="py-2">{patient.disability}</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-2 font-semibold text-gray-600">Country:</td>
                <td className="py-2">{patient.country}</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-2 font-semibold text-gray-600">City:</td>
                <td className="py-2">{patient.city}</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-2 font-semibold text-gray-600">Phone Number:</td>
                <td className="py-2">{patient.phone}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Appointments Section */}
        <h2 className="text-xl font-semibold mb-4 text-primary text-left">Appointments</h2>
        <div className="mb-6 border-t border-gray-200 pt-4">
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-600">
                <th className="py-2">Session ID</th>
                <th className="py-2">Doctor</th>
              </tr>
            </thead>
            <tbody>
              {patient.appointments.length > 0 ? (
                patient.appointments.map((appointment, index) => (
                  <tr key={index} className="border-t border-gray-200">
                    <td className="py-2">{appointment.sessionId}</td>
                    <td className="py-2">{appointment.doctor}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="py-2 text-center text-gray-500">
                    No Appointments Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Psync Posts Section */}
        <h2 className="text-xl font-semibold mb-4 text-primary text-left">Psync Posts</h2>
        <div className="border-t border-gray-200 pt-4">
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-600">
                <th className="py-2">Post ID</th>
                <th className="py-2">Posted On</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patient.psyncPosts.length > 0 ? (
                patient.psyncPosts.map((post, index) => (
                  <tr key={index} className="border-t border-gray-200">
                    <td className="py-2">{post.postId}</td>
                    <td className="py-2">{post.postedOn}</td>
                    <td className="py-2">
                      <button className="text-teal-500 font-semibold hover:underline">
                        View →
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-2 text-center text-gray-500">
                    No Psync Posts Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </div>
  );
};

export default PatientDetails;
