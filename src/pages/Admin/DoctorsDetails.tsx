import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { Doctor } from "./Doctors"; // Adjust the import path as necessary
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const DoctorsDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const doctor = location.state?.doctor as Doctor;

  console.log("DOCTOR", doctor);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!doctor) {
    return (
      <div className="p-6 text-center ">
        <h1 className="text-2xl font-semibold text-gray-600">No Doctor Data Found</h1>
        <button
          className="mt-4 px-4 py-2 bg-primary text-white rounded shadow hover:bg-primaryHover"
          onClick={() => navigate("/")}
        >
          Go Back
        </button>
      </div>
    );
  }

  console.table(doctor);
  
  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
  };
  
  const handleApprove = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        `http://localhost:8000/api/admin/doctors/verify/${doctor.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to approve doctor.");
      }
   
      setSuccess("Doctor approved successfully!");
      toast.success("Doctor approved successfully!");
      setTimeout(() => navigate("/admin/doctors"), 2500); // Navigate back after 2 seconds
    } catch (err: any) {
      setError(err.message || "An error occurred while approving the doctor.");
      toast.error(err.message || "An error occurred while approving the doctor.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteUser = () => {
    console.log(`Delete user with ID: ${doctor.id}`);
    // API call will be added later
  };

  return (
    <div className="p-6 bg-secondary">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg h-screen p-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <FaArrowLeft
            className="text-primary cursor-pointer hover:text-gray-800 mr-4"
            onClick={() => navigate("/admin/doctors")}
            size={20}
          />
          <h1 className="text-3xl font-semibold">{doctor.name}</h1>
          <div className="ml-auto flex gap-4">
            {doctor.status === "approved" ? (
              <button 
                className="px-4 w-[140px] py-2 rounded-xl bg-red-500 text-white shadow hover:bg-red-600"
                onClick={handleDeleteUser}
              >
                Delete User
              </button>
            ) : (
              <>
                <button
                  className="px-4 w-[100px] py-2 rounded-xl bg-primary text-white shadow hover:bg-primaryHover disabled:opacity-50 flex items-center justify-center"
                  onClick={handleApprove}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <AiOutlineLoading3Quarters className="animate-spin mr-1" />
                      <span>Approving...</span>
                    </>
                  ) : success?( <>
                    <span>Approved</span>
                  </>) : (
                    "Approve"
                  )}
                 
                </button>
                <button className="px-4 py-2 w-[100px] rounded-xl bg-red-500 text-white shadow hover:bg-red-600">
                  Remove
                </button>
              </>
            )}
          </div>
        </div>
        <div className="overflow-auto h-[88%] custom-scrollbar">

        
        {/* Doctor Details Section */}
        <h2 className="text-xl font-semibold mb-4 text-primary text-left">Doctor Details</h2>
        <div className="mb-6 border-t border-gray-200 pt-4">
          <table className="table-auto w-full text-left border-collapse">
            <tbody>
              <tr className="">
                <td className="py-2 font-semibold text-gray-600">Email:</td>
                <td className="py-2">{doctor.email}</td>
              </tr>
              <tr className="">
                <td className="py-2 font-semibold text-gray-600">Name:</td>
                <td className="py-2">{doctor.name}</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-2 font-semibold text-gray-600">Date of Birth:</td>
                <td className="py-2">{formatDate(doctor.dateOfBirth)}</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-2 font-semibold text-gray-600">Gender:</td>
                <td className="py-2">{doctor.gender}</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-2 font-semibold text-gray-600">Profile Picture:</td>
                <td className="py-2">
                  {doctor.profilePicture && (
                    <div className="w-24 h-24 overflow-hidden rounded-lg">
                      <img 
                        src={doctor.profilePicture} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-2 font-semibold text-gray-600">Country:</td>
                <td className="py-2">{doctor.country}</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-2 font-semibold text-gray-600">City:</td>
                <td className="py-2">{doctor.city}</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-2 font-semibold text-gray-600">Phone:</td>
                <td className="py-2">{doctor.phone}</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-2 font-semibold text-gray-600">Status:</td>
                <td className="py-2">{doctor.status}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Professional Details Section */}
        <h2 className="text-xl font-semibold mb-4 text-primary text-left">Professional Details</h2>
        <div className="mb-6 border-t border-gray-200 pt-4">
          <table className="table-auto w-full text-left border-collapse">
            <tbody>
              <tr className=" ">
                <td className="py-2 font-semibold text-gray-600">Specialization:</td>
                <td className="py-2">{doctor.specialization}</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-2 font-semibold text-gray-600">PMDC Number:</td>
                <td className="py-2">{doctor.pmdcNumber}</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-2 font-semibold text-gray-600">Education:</td>
                <td className="py-2">{doctor.education.join(", ")}</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-2 font-semibold text-gray-600">License Certification:</td>
                <td className="py-2">
                  {doctor.licenseCertification && (
                    <div className="w-48 overflow-hidden rounded-lg">
                      <img 
                        src={doctor.licenseCertification} 
                        alt="License Certification" 
                        className="w-full object-contain"
                      />
                    </div>
                  )}
                </td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-2 font-semibold text-gray-600">CNIC Number:</td>
                <td className="py-2">{doctor.cnicNumber}</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-2 font-semibold text-gray-600">Availability:</td>
                <td className="py-2">{doctor?.availability?.[0]?.startTime} - {doctor?.availability?.[0]?.endTime}</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-2 font-semibold text-gray-600">Fee Rate:</td>
                <td className="py-2">{doctor.feeRate}</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-2 font-semibold text-gray-600">Bank Account Number:</td>
                <td className="py-2">{doctor.bankAccountNumber}</td>
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
                <th className="py-2">Patient Ids</th>
              </tr>
            </thead>
            <tbody>
              {doctor.appointments.length > 0 ? (
                doctor.appointments.map((appointment, index) => (
                  <tr key={index} className="border-t border-gray-200">
                    <td className="py-2">{appointment.appointmentId}</td>
                    <td className="py-2">{appointment.patientId}</td>
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

       {/* Psyc Posts Section */}
        <h2 className="text-xl font-semibold mb-4 text-primary text-left">Psyc Posts</h2>
        <div className="border-t border-gray-200 pt-4">
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-600">
                <th className="py-2">Post ID</th>
                <th className="py-2">Post Title</th>
                {/* <th className="py-2">Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {doctor.posts.length > 0 ? (
                doctor.posts.map((post, index) => (
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
                    No Psyc Posts Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      </div>
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

export default DoctorsDetails;