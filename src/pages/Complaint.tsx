import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import usePreviewImage from "@/hooks/usePreviewImage";

const issueTypes = ["Payment Issue", "Psync Harrasment Issue", "Session Issue"];

const Complaint: React.FC = () => {
  const [issueType, setIssueType] = useState<string>(issueTypes[0]);
  const [issueDescription, setIssueDescription] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  const user = useRecoilValue(userAtom);
  
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!issueDescription.trim()) {
      toast.error("Please describe your issue");
      return;
    }

    try {
      setSubmitting(true);
      
      const complaintData = {
        userId: user._id,
        userName: user.name || user.username,
        userRole: user.role,
        issueType,
        issueDescription,
        issueImg: imgUrl,
      };

      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(complaintData),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to submit complaint");
      }

      toast.success("Complaint submitted successfully");
      setTimeout(() => {
        navigate(`/${user.role}/complaintslist`);
      }, 2000);
    } catch (error) {
      toast.error("Error submitting complaint");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#D3EDEB] min-h-screen w-full flex justify-center mt-10">
      <div className="w-full max-w-screen-xl p-4 bg-[#D3EDEB] mt-10">
        <div className="bg-[#fff] rounded-xl shadow p-6 mb-6">
          <div className="mb-4 flex items-center">
            <button
              onClick={() => navigate(`/${user.role}/complaintslist`)}
              className="flex items-center text-primary hover:text-primaryHover"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Complaints
            </button>
          </div>

          <h1 className="text-2xl font-bold mb-6">Submit a Complaint</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block text-gray-700 font-medium mb-2">Issue Type</label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryHover focus:border-transparent"
                required
              >
                {issueTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-5">
              <label className="block text-gray-700 font-medium mb-2">
                Issue Description
              </label>
              <textarea
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryHover focus:border-transparent"
                rows={5}
                placeholder="Please describe your issue in detail..."
                required
              ></textarea>
            </div>

            <div className="mb-8">
              <label className="block text-gray-700 font-medium mb-2">
                Supporting Image (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryHover focus:border-transparent"
              />
              {imgUrl && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Preview:</p>
                  <div className="relative w-64 h-64">
                    <img
                      src={imgUrl}
                      alt="Issue preview"
                      className="w-full h-full object-cover rounded-lg shadow"
                    />
                    <button
                      type="button"
                      onClick={() => setImgUrl("")}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primaryHover focus:outline-none focus:ring-2 focus:ring-primaryHover transition-colors font-medium ${
                submitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {submitting ? "Submitting..." : "Send Complaint"}
            </button>
          </form>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />
    </div>
  );
};

export default Complaint;