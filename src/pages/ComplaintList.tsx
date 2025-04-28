import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Complaint {
  _id: string;
  issueType: string;
  status: string;
  date: string;
}

const ComplaintList: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = useRecoilValue(userAtom);

  useEffect(() => {
    const fetchComplaints = async () => {
      console.log("this is user._id in complaints : ", user._id);
      try {
        const res = await fetch(`/api/complaints/user/${user._id}`, {
          credentials: "include",
        });
        
        if (!res.ok) {
          throw new Error("Failed to fetch complaints");
        }
        
        const data = await res.json();
        setComplaints(data);
      } catch (error) {
        toast.error("Error fetching complaints");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchComplaints();
    }
  }, [user]);

  const handleCreateComplaint = () => {
    navigate(`/${user.role}/complaintslist/complaint`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-[#D3EDEB] min-h-screen w-full flex justify-center mt-10">
      <div className="w-full max-w-screen-xl p-4 bg-[#D3EDEB]  mt-10">
        <div className="bg-[#fff] rounded-xl min-h-96 shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">My Complaints</h1>
            <button
              onClick={handleCreateComplaint}
              className="bg-primary hover:bg-primaryHover text-white px-4 py-2 rounded"
            >
              Create Complaint
            </button>
          </div>

          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : complaints.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-center text-xl text-gray-600 font-semibold mt-8">
                <span className="text-teal-600">You haven't submitted any complaints yet.</span>
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-3 px-4 border-b text-left font-semibold">Date</th>
                    <th className="py-3 px-4 border-b text-left font-semibold">Issue Type</th>
                    <th className="py-3 px-4 border-b text-left font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((complaint) => (
                    <tr key={complaint._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 border-b">{formatDate(complaint.date)}</td>
                      <td className="py-3 px-4 border-b">{complaint.issueType}</td>
                      <td className="py-3 px-4 border-b">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            complaint.status === "Pending"
                              ? "bg-secondary text-primary"
                              : complaint.status === "In Progress"
                              ? "bg-blue-100 text-blue-800"
                              : complaint.status === "Resolved"
                              ? "bg-primary text-white"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {complaint.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />
    </div>
  );
};

export default ComplaintList;