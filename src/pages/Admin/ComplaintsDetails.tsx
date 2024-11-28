import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { Query } from "./data/interfaces";

const ComplaintsDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = location.state as Query;

  if (!query) {
    return <div>No query data available.</div>;
  }

  return (
    <div className="flex justify-center mt-6 bg-secondary">
      <div className="w-[95%] p-6 bg-white rounded-lg shadow-lg overflow-auto max-h-[470px] h-screen custom-scrollbar">
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
          {query.status === "Pending" ? (
            <button className="bg-primary text-white px-4 py-2 rounded shadow hover:bg-primaryHover">
              Start Processing
            </button>
          ) : (
            <button className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700">
              Resolved
            </button>
          )}
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Circular Placeholder */}
            <div className="flex items-center space-x-4">
              <div>
                <p className="flex items-center">
                  <strong className="text-primary font-semibold mr-2">
                    Complain By:
                  </strong> <div className="w-10 h-10 bg-gray-300 rounded-full flex mx-2">
               
              </div>
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
              {query.status}
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
    </div>
  );
};

export default ComplaintsDetails;
