'use client'

import { useState } from "react";
import { Button } from "@/Components/ui/button";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string | undefined;
}

export default function ReviewModal({ isOpen, onClose, appointmentId }: ReviewModalProps) {
  const [rating, setRating] = useState<number>(0);
  const [publicReview, setPublicReview] = useState<string>("");
  const [privateReview, setPrivateReview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleRating = (index: number) => {
    setRating(index);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:8000/api/patient/reviews/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          appointmentId,
          rating,
          review: publicReview,
          privateReview: privateReview.trim() ? privateReview : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit review');
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white p-8 rounded-lg max-w-4xl w-full">
        <div className="flex flex-row justify-between items-start">
          <div className="p-2">
            <h2 className="text-2xl font-semibold text-left">Leave a Review</h2>
            <p className="text-left w-96 mt-4">
              We hope this session was helpful for you.
              Please be kind to leave a review for the doctor.
              You can even send the doctor a private review only visible to the doctor.
            </p>
          </div>

          <div className="flex flex-col m-6 mr-8">
            <div className="flex justify-center items-center space-x-2">
              {/* Star Rating */}
              {[1, 2, 3, 4, 5].map((index) => (
                <svg
                  key={index}
                  onClick={() => handleRating(index)}
                  className={`w-8 h-8 cursor-pointer ${index <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.813l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.537 1.118l-2.8-2.034a1 1 0 0 0-1.176 0l-2.8 2.034c-.782.57-1.837-.197-1.537-1.118l1.07-3.292a1 1 0 0 0-.364-1.118l-2.8-2.034c-.783-.573-.381-1.813.588-1.813h3.462a1 1 0 0 0 .95-.69l1.07-3.292z"></path>
                </svg>
              ))}
            </div>
            <div>
              <label className="block text-lg font-medium text-center">
                Tell Us Your Experience
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-4 px-10 mt-6">
          <label className="block text-lg font-medium text-gray-700 text-left">
            Public Review
          </label>
          <textarea
            className="form-textarea bg-[#F5F5F5] p-2 mt-1 block w-full rounded-md border-black shadow-sm"
            rows={4}
            placeholder="Your public review"
            value={publicReview}
            onChange={(e) => setPublicReview(e.target.value)}
          ></textarea>
          <label className="block text-lg font-medium text-gray-700 text-left">
            Private Review (Optional)
          </label>
          <textarea
            className="form-textarea p-2 bg-[#F5F5F5] mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            rows={4}
            placeholder="Your private review"
            value={privateReview}
            onChange={(e) => setPrivateReview(e.target.value)}
          ></textarea>
        </div>

        {error && (
          <div className="mt-4 text-red-500 text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 text-green-500 text-center">
            Review submitted successfully!
          </div>
        )}

        <div className="flex justify-end items-end mt-6 mr-6">
          <button
            className={`ml-4 ${isSubmitting ? 'bg-gray-300' : 'text-green-500 hover:text-green-700'} font-bold py-2 px-4 rounded`}
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}