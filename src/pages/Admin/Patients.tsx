import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegStickyNote, FaTrash } from "react-icons/fa";
import DeleteModal from "../../Components/admin/DeleteModalAdmin"; // Adjust the import path as needed

interface PersonalInformation {
  fullName: string;
  age: number;
  gender: string;
  country: string;
  city: string;
  phoneNo: string;
  image: string;
}

interface Patient {
  _id: string;
  userId: string;
  email: string;
  createdAt: string;
  personalInformation: PersonalInformation;
}

const Patients: React.FC = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  // Modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/api/admin/patients");
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setPatients(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      setLoading(false);
    }
  };

  const handleDetails = (patientid) => {
    console.log("Patient ID:", patientid);
    navigate(`/admin/patients/${patientid}`);
  };

  const openDeleteModal = (patient: Patient) => {
    setPatientToDelete(patient);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setPatientToDelete(null);
  };

  const confirmDelete = async () => {
    if (!patientToDelete) return;
    
    try {
      const response = await fetch(`http://localhost:8000/api/admin/patients/${patientToDelete._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // Remove patient from state
      setPatients(patients.filter(patient => patient._id !== patientToDelete._id));
      
      // Close the modal
      closeDeleteModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete patient");
      closeDeleteModal();
    }
  };

  // Get username from email (part before @)
  const getUsernameFromEmail = (email: string) => {
    return email?.split('@')[0];
  };

  // Get time ago from date
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
      return interval === 1 ? "1 year ago" : `${interval} years ago`;
    }
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      return interval === 1 ? "1 month ago" : `${interval} months ago`;
    }
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return interval === 1 ? "1 day ago" : `${interval} days ago`;
    }
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return interval === 1 ? "1 hour ago" : `${interval} hours ago`;
    }
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return interval === 1 ? "1 minute ago" : `${interval} minutes ago`;
    }
    
    return seconds <= 5 ? "just now" : `${Math.floor(seconds)} seconds ago`;
  };

  // Filter patients based on search term
  const filteredPatients = patients.filter(
    patient => {
      const patientName = patient.personalInformation?.fullName || getUsernameFromEmail(patient.email);
      return patient._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
             patientName.toLowerCase().includes(searchTerm.toLowerCase());
    }
  );

  return (
    <div className="flex justify-center mt-6 bg-secondary">
      <div className="w-[95%] p-6 bg-white rounded-lg shadow-lg mb-8 h-screen">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-semibold">Find Patients</h1>
          <input
            type="text"
            placeholder="Search by Id or Name"
            className="p-2 border rounded w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <p className="text-gray-500 mb-2">
          <span className="font-semibold">{filteredPatients.length} Results Found</span>
        </p>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl">Loading patients...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-red-500">Error: {error}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 overflow-auto h-[80%] custom-scrollbar">
            {filteredPatients.map((patient) => (
              <div key={patient._id} className="flex justify-between py-4">
                {/* Left Section: Patient Details */}
                <div className="flex flex-col items-start min-w-[200px]">
                  <p className="text-lg font-medium truncate">
                    {patient.personalInformation?.fullName || getUsernameFromEmail(patient.email) || patient.userId}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    Joined - {getTimeAgo(patient.createdAt)}
                  </p>
                </div>

                {/* Right Section: Buttons */}
                <div className="flex-shrink-0 flex gap-2">
                  <button
                    className="px-4 py-2 bg-[#F0F0F0] flex font-light border border-gray-300 text-primary rounded-lg shadow hover:bg-primary hover:text-white"
                    onClick={() => handleDetails(patient._id)}
                  >
                    <FaRegStickyNote className="w-4 h-7 mr-2" />
                    Details
                  </button>
                  <button 
                    className="px-4 py-2 flex bg-[#F0F0F0] font-light border border-gray-300 text-primary rounded-lg shadow hover:bg-primary hover:text-white"
                    onClick={() => openDeleteModal(patient)}
                  >
                    <FaTrash className="w-4 h-7 mr-2" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Delete Patient"
        message="Are you sure you want to delete this patient"
        itemName={patientToDelete?.personalInformation?.fullName || (patientToDelete?.email ? getUsernameFromEmail(patientToDelete.email) : '')}
      />
    </div>
  );
};

export default Patients;