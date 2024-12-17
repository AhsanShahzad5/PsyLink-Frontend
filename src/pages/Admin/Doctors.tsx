import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegStickyNote } from "react-icons/fa"; // Font Awesome
import { FaTrash } from "react-icons/fa"; // Font Awesome

export interface Doctor {
  id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  profilePicture: string;
  country: string;
  city: string;
  phone: string;
  specialization: string;
  pmdcNumber: string;
  education: string[];
  licenseCertification: string;
  cnicNumber: string;
  availability: string;
  feeRate: string;
  bankAccountNumber: string;
  appointments: { sessionId: string; patientName: string }[];
  posts: { postId: string; postedOn: string }[];
}

const Doctors: React.FC = () => {
  const navigate = useNavigate();
  const [doctorData, setDoctorData] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://localhost:8000/api/admin/doctors/pending",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch doctor data");
        }

        const data = await response.json();

        // Map API data to Doctor structure
        const mappedData: Doctor[] = data.map((doctor: any) => ({
          id: doctor?._id || "N/A",
          name: doctor?.clinic?.fullName || doctor?.personalDetails?.fullName || "N/A",
          email: "N/A", // Add actual field if available in API
          dateOfBirth: doctor?.personalDetails?.dateOfBirth || "N/A",
          gender: doctor?.personalDetails?.gender || "N/A",
          profilePicture: doctor?.personalDetails?.image || "N/A",
          country: doctor?.personalDetails?.country || "N/A",
          city: doctor?.personalDetails?.city || "N/A",
          phone: doctor?.personalDetails?.phoneNo || "N/A",
          specialization: doctor?.clinic?.specialisation || doctor?.professionalDetails?.specialisation || "N/A",
          pmdcNumber: doctor?.professionalDetails?.pmdcNumber || "N/A",
          education: [doctor?.professionalDetails?.educationalBackground || "N/A"],
          licenseCertification: doctor?.professionalDetails?.licenseImage || "N/A",
          cnicNumber: doctor?.professionalDetails?.cnicNumber || "N/A",
          availability: "N/A", // Add actual field if available in API
          feeRate: doctor?.clinic?.consultationFee?.toString() || "N/A",
          bankAccountNumber: doctor?.professionalDetails?.bankDetails?.accountNumber || "N/A",
          appointments: doctor?.appointments || [],
          posts: [], // Add actual field if available in API
        }));

        setDoctorData(mappedData);
        setError(null);
      } catch (err) {
        setError("Failed to fetch doctor data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  console.log(doctorData);

  const handleDetails = (doctor: Doctor) => {
    navigate("/admin/doctors/doctor-details", { state: { doctor } });
  };

  return (
    <div className="flex justify-center mt-6 bg-secondary">
      <div className="w-[95%] p-6 bg-white rounded-lg shadow-lg mb-8 h-screen ">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-semibold">Find Doctors</h1>
          <input
            type="text"
            placeholder="Search by Name or Specialization"
            className="p-2 border rounded w-64"
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <p className="text-gray-500 mb-2">
              <span className="font-semibold">{doctorData.length} Results Found</span>
            </p>
            <div className="divide-y w-full divide-gray-200 overflow-auto h-[80%] custom-scrollbar">
              {doctorData.map((doctor) => (
                <div key={doctor.id} className="flex justify-between py-4">
                  {/* Left Section: Doctor Details */}
                  <div className="flex flex-col items-start min-w-[200px]">
                    <p className="text-lg font-medium truncate">{doctor.name}</p>
                    <p className="text-sm text-gray-500 truncate">
                      {doctor.specialization}
                    </p>
                  </div>

                  {/* Right Section: Buttons */}
                  <div className="flex-shrink-0 flex gap-2">
                    <button
                      className="px-4 py-2 bg-[#F0F0F0] flex font-light border border-gray-300 text-primary rounded-lg shadow hover:bg-primary hover:text-white"
                      onClick={() => handleDetails(doctor)}
                    >
                      <FaRegStickyNote className="w-4 h-7 mr-2" />
                      Details
                    </button>
                    <button className="px-4 py-2 flex bg-[#F0F0F0] font-light border border-gray-300 text-primary rounded-lg shadow hover:bg-primary hover:text-white">
                      <FaTrash className="w-4 h-7 mr-2" />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Doctors;
