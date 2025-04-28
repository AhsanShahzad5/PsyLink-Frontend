import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import userAtom from "@/atoms/userAtom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';

interface Review {
  _id: string;
  patientId: string;
  patientName: string;
  privateReview: string;
}

const PrivateReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const user = useRecoilValue(userAtom);
  const navigate = useNavigate();
  console.log('this is user in privateReviews', user._id)
  
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/doctor/private-reviews', {
        method: 'GET',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      
      const data = await response.json();
      setReviews(data.privateReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    setIsDeleting(reviewId);
    try {
      const response = await fetch(`http://localhost:8000/api/doctor/private-reviews/${reviewId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ doctorId: user._id }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete review');
      }
      
      // Remove the deleted review from state
      setReviews(reviews.filter(review => review._id !== reviewId));
      toast.success('Review deleted successfully');
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="pt-20 max-w-[90rem] mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading private reviews...</p>
        </div>
        <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />
      </div>
    );
  }

  return (
    <div className="pt-20 max-w-[90rem] mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 min-h-[600px]">
        <div className="flex items-center mb-8">
          <button 
            onClick={handleBack}
            className="flex items-center mr-8 transition"
            style={{ color: "#02968A" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h2 className="text-2xl font-bold text-gray-800">Private Patient Reviews</h2>
        </div>
        
        {reviews.length === 0 ? (
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <p className="text-gray-500">No private reviews available</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div 
                key={review._id} 
                className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg" style={{ color: "#02968A" }}>{review.patientName}</h3>
                    <p className="mt-2 text-gray-700 whitespace-pre-line">{review.privateReview}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    disabled={isDeleting === review._id}
                    className="text-red-500 hover:text-red-700 ml-4 flex items-center"
                  >
                    {isDeleting === review._id ? (
                      <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                    {isDeleting === review._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />
    </div>
  );
};

export default PrivateReviews;