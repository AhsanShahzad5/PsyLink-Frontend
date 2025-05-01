import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


interface Query {
  complaintId: string;
  complainBy: {
    patientId?: string;
    patientName?: string;
    doctorId?: string;
    doctorName?: string;
  };
  type: string;
  description: string;
  images: string[];
  status: "Pending" | "In Progress" | "Resolved" | "Rejected";
  dateTime: string;
}

const ComplaintsDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState<Query>(location.state as Query);
  const [isLoading, setIsLoading] = useState(false);

  if (!query) {
    return <div>No query data available.</div>;
  }

  const handleStartProcessing = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/complaints/start/${query.complaintId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to start processing complaint");
      }

      // Update the local state with the new status
      setQuery({
        ...query,
        status: "In Progress",
      });

      toast.success("Complaint is now in progress");
    } catch (error) {
      console.error("Error starting complaint processing:", error);
      toast.error(error instanceof Error ? error.message : "Failed to start processing complaint");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolve = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/complaints/resolve/${query.complaintId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to resolve complaint");
      }

      // Update the local state with the new status
      setQuery({
        ...query,
        status: "Resolved",
      });

      toast.success("Complaint resolved successfully");
    } catch (error) {
      console.error("Error resolving complaint:", error);
      toast.error(error instanceof Error ? error.message : "Failed to resolve complaint");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/complaints/reject/${query.complaintId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to reject complaint");
      }

      // Update the local state with the new status
      setQuery({
        ...query,
        status: "Rejected",
      });

      toast.success("Complaint rejected");
    } catch (error) {
      console.error("Error rejecting complaint:", error);
      toast.error(error instanceof Error ? error.message : "Failed to reject complaint");
    } finally {
      setIsLoading(false);
    }
  };

  const renderActionButtons = () => {
    if (isLoading) {
      return (
        <button disabled className="bg-gray-400 text-white px-4 py-2 rounded shadow">
          Processing...
        </button>
      );
    }

    if (query.status === "Pending") {
      return (
        <button 
          className="bg-primary text-white px-4 py-2 rounded shadow hover:bg-primaryHover"
          onClick={handleStartProcessing}
        >
          Start Processing
        </button>
      );
    } else if (query.status === "In Progress") {
      return (
        <div className="flex space-x-3">
          <button 
            className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
            onClick={handleResolve}
          >
            Resolve
          </button>
          <button 
            className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700"
            onClick={handleReject}
          >
            Reject
          </button>
        </div>
      );
    } else if (query.status === "Resolved") {
      return (
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded">
          Resolved
        </div>
      );
    } else if (query.status === "Rejected") {
      return (
        <div className="bg-red-100 text-red-800 px-4 py-2 rounded">
          Rejected
        </div>
      );
    }
  };

  return (
    <div className="flex justify-center mt-6 bg-secondary">
      <div className="w-[95%] p-6 bg-white rounded-lg shadow-lg overflow-auto h-screen custom-scrollbar">
        {/* Back button and Heading */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <FaArrowLeft
              className="text-primary cursor-pointer hover:text-gray-800 mr-4"
              onClick={() => navigate(-1)}
              size={20}
            />
            <h1 className="text-3xl font-semibold">
              Complaint ID: {query.complaintId}
            </h1>
          </div>
          {/* Dynamic Button */}
          {renderActionButtons()}
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* User Info with Avatar */}
            <div className="flex items-center space-x-4">
              <div>
                <p className="flex items-center">
                  <strong className="text-primary font-semibold mr-2">
                    Complain By:
                  </strong> 
                  <div className="w-10 h-10 rounded-full flex mx-2"></div>
                  {"patientId" in query.complainBy
                    ? `${query.complainBy.patientName} (ID: ${query.complainBy.patientId})`
                    : `${query.complainBy.doctorName} (ID: ${query.complainBy.doctorId})`}
                </p>
              </div>
            </div>
            <p>
              <strong className="text-primary font-semibold mr-2">
                Type:
              </strong>
              {query.type}
            </p>
            <p>
              <strong className="text-primary font-semibold mr-2">
                Description:
              </strong>
              {query.description}
            </p>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <p>
              <strong className="text-primary font-semibold mr-2">
                Status:
              </strong>
              <span className={`${
                query.status === "Pending" ? "text-yellow-600" :
                query.status === "In Progress" ? "text-blue-600" :
                query.status === "Resolved" ? "text-green-600" :
                "text-red-600"
              }`}>
                {query.status}
              </span>
            </p>
            <p>
              <strong className="text-primary font-semibold mr-2">
                Date & Time:
              </strong>
              {query.dateTime}
            </p>
            <p>
              <strong className="text-primary font-semibold mr-2">
                Images:
              </strong>
              {query.images.length > 0 ? (
                <div className="flex space-x-2 mt-2">
                  {query.images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Query ${query.complaintId} Image ${index + 1}`}
                      className="w-32 h-32 object-cover rounded"
                    />
                  ))}
                </div>
              ) : (
                "No Images"
              )}
            </p>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />
    </div>
  );
};

export default ComplaintsDetails;