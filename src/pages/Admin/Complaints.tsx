// Complaints.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Query } from "./data/interfaces";

const Complaints: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"Pending" | "In Progress">("Pending");
  const [pendingComplaints, setPendingComplaints] = useState<Query[]>([]);
  const [inProgressComplaints, setInProgressComplaints] = useState<Query[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch complaints based on active tab
  useEffect(() => {
    fetchComplaints();
  }, [activeTab]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      let endpoint = activeTab === "Pending" ? "/api/complaints/pending" : "/api/complaints/in-progress";
      
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch complaints");
      }
      
      // Transform backend data to match our frontend interface
      const transformedData: Query[] = result.data.map((item: any) => ({
        complaintId: item._id,
        complainBy: {
          ...(item.userRole === "Patient" 
            ? { patientId: item.userId, patientName: item.userName } 
            : { doctorId: item.userId, doctorName: item.userName }),
        },
        type: item.issueType,
        description: item.issueDescription,
        images: item.issueImg ? [item.issueImg] : [],
        status: item.status,
        dateTime: new Date(item.date).toLocaleString(),
      }));
      
      if (activeTab === "Pending") {
        setPendingComplaints(transformedData);
      } else {
        setInProgressComplaints(transformedData);
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
      toast.error(error instanceof Error ? error.message : "Failed to fetch complaints");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (query: Query) => {
    navigate("/admin/complaints/complaint-details", { state: query });
  };

  const displayedQueries = activeTab === "Pending" ? pendingComplaints : inProgressComplaints;

  return (
    <div className="flex justify-center mt-6 bg-secondary">
      <div className="w-[95%] p-6 bg-white h-screen rounded-lg mb-8 shadow-lg">
        {/* Tabs */}
        <h1 className="text-3xl font-semibold mb-6">{activeTab} Queries</h1>
        <div className="mb-4">
          <nav className="flex justify-around">
            <button
              className={`flex py-3 px-3 text-center border-b-2 font-medium text-lg ${
                activeTab === "Pending"
                  ? "border-primary text-primary"
                  : "border-gray-300 text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("Pending")}
            >
              Pending
            </button>
            <button
              className={`flex py-3 px-3 text-center border-b-2 font-medium text-lg ${
                activeTab === "In Progress"
                  ? "border-primary text-primary"
                  : "border-gray-300 text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("In Progress")}
            >
              In Progress
            </button>
          </nav>
        </div>

        {/* Queries Table */}
        <div className="overflow-auto h-[80%] custom-scrollbar">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <p className="text-gray-500">Loading complaints...</p>
            </div>
          ) : displayedQueries.length === 0 ? (
            <div className="flex justify-center items-center h-48">
              <p className="text-gray-500">No {activeTab.toLowerCase()} complaints found.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-normal text-primary">Complaint ID</th>
                  <th className="px-6 py-3 text-left text-sm font-normal text-primary">Complain By</th>
                  <th className="px-6 py-3 text-left text-sm font-normal text-primary">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-normal text-primary">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayedQueries.map((query) => (
                  <tr key={query.complaintId}>
                    <td className="px-6 py-3 whitespace-nowrap text-md font-normal text-black">
                      {query.complaintId}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-md font-normal text-black">
                      {"patientId" in query.complainBy
                        ? query.complainBy.patientName
                        : query.complainBy.doctorName}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-md font-normal text-black">
                      {query.type}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-md font-normal text-black">
                      <button
                        className="text-teal-500 font-normal hover:underline"
                        onClick={() => handleView(query)}
                      >
                        View →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />
    </div>
  );
};

export default Complaints;