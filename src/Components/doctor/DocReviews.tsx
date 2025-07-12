import React, { useState, useEffect } from 'react';
import { FaSpinner, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from "recoil";
import userAtom from "@/atoms/userAtom";

interface Review {
  _id: string;
  patientName: string;
  rating: number;
  review?: string;
  date: string;
}

interface ReviewStats {
  totalReviews: number;
  fiveStarCount: number;
  averageRating: number;
}

interface DocReviewsProps {
  doctorId: string;
}

const DocReviews: React.FC<DocReviewsProps> = ({ doctorId }) => {
  const user = useRecoilValue(userAtom);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [stats, setStats] = useState<ReviewStats>({
    totalReviews: 0,
    fiveStarCount: 0,
    averageRating: 0
  });
  const reviewsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/api/doctor/reviews?doctorId=${doctorId}&page=${currentPage}&limit=${reviewsPerPage}`, {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }

        const data = await response.json();
        console.log("this is data got from reviews section: ", data)
        setReviews(data.reviews);
        setTotalPages(Math.ceil(data.total / reviewsPerPage));
        
        // Set statistics
        setStats({
          totalReviews: data.total,
          fiveStarCount: data.fiveStarCount || 0,
          averageRating: data.averageRating || 0
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [doctorId, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <FaStar 
        key={i} 
        className={i < rating ? 'text-yellow-500' : 'text-gray-300'} 
      />
    ));
  };

  const navigateToPrivateReviews = () => {
    navigate('/doctor/clinic/privateReviews');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <FaSpinner className="animate-spin text-4xl text-[#02968A] mb-4" />
        <p className="text-lg font-medium">Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }


  return (
    <div className='bg-white rounded-lg p-4 my-2'>
      <div className="flex justify-between items-center px-6">
        <h1 className="text-[1.8rem]">Your Stats</h1>
        {user.role === "doctor" && (
          <button 
            onClick={navigateToPrivateReviews}
            className="bg-[#02968A] hover:bg-[#01857A] text-white py-2 px-3 rounded-md shadow-sm transition-all duration-300 flex items-center text-sm"
          >
            View Private Reviews
          </button>
        )}
      </div>
            
      <div className="flex flex-wrap justify-center gap-6 mt-8"></div>  
      {/* Review Statistics */}
      <div className="flex flex-wrap justify-center gap-4 mb-12 px-4">
        <div className="flex items-center justify-center text-white rounded-[0.6rem] w-60 h-16 shadow-md sm:w-56 sm:h-14 md:w-60 md:h-16" style={{ background: 'linear-gradient(90deg, #047D72 0%, #014B44 100%)' }}>
          <div className="flex items-center gap-2">
            <p className="font-outfit font-extrabold text-lg sm:text-base md:text-lg">{stats.fiveStarCount}</p>
            <p className="font-outfit font-semibold text-lg sm:text-sm md:text-base">Five Star Reviews</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center text-white rounded-[0.6rem] w-60 h-16 shadow-md sm:w-56 sm:h-14 md:w-60 md:h-16" style={{ background: 'linear-gradient(90deg, #047D72 0%, #014B44 100%)' }}>
          <div className="flex items-center gap-2">
            <p className="font-outfit font-extrabold text-lg sm:text-base md:text-lg">{stats.averageRating.toFixed(1)}</p>
            <div className="text-secondary p-2 rounded-full">
              <FaStar size={18} />
            </div>
            <p className="font-outfit font-semibold text-lg sm:text-sm md:text-base">Average Rating</p>
          </div>
        </div>
      </div>
   
      <h2 className="text-[1.8rem] ml-6">Patient Reviews</h2>
      
      {reviews.length === 0 ? (
        <div className="bg-gray-50 p-4 rounded-lg text-center mx-4">
          <p className="text-base text-gray-600">No reviews available for this doctor yet.</p>
        </div>
      ) : (
        <>
          <div className="space-y-3 px-4">
            {reviews.map((review) => (
              <div 
                key={review._id} 
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:border-[#02968A]"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-800 text-base">{review.patientName}</h3>
                  <div className="flex items-center">
                    {renderStars(review.rating)}
                    <span className="ml-2 text-gray-600 text-sm">({review.rating})</span>
                  </div>
                </div>
                
                {review.review ? (
                  <p className="text-gray-600 text-sm">{review.review}</p>
                ) : (
                  <div className="h-4"></div> // Empty space when no review text
                )}
                
                <div className="text-right mt-2">
                  <span className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
   
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-2 py-1 rounded text-sm ${
                    currentPage === 1 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                      : 'bg-gray-100 text-gray-800 hover:bg-[#02968A] hover:text-white'
                  }`}
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-2 py-1 rounded text-sm ${
                      currentPage === page
                        ? 'bg-[#02968A] text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-[#02968A] hover:text-white'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-2 py-1 rounded text-sm ${
                    currentPage === totalPages
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-800 hover:bg-[#02968A] hover:text-white'
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
   );

  // return (
  //   <div className='bg-white rounded-lg p-5 my-2'>
  //     <div className="flex justify-between items-center px-10">
  //       <h1 className="text-[2.5rem]">Your Stats</h1>
  //       {user.role === "doctor" && (
  //         <button 
  //           onClick={navigateToPrivateReviews}
  //           className="bg-[#02968A] hover:bg-[#01857A] text-white py-2 px-4 rounded-md shadow-sm transition-all duration-300 flex items-center"
  //         >
  //           View Private Reviews
  //         </button>
  //       )}
  //     </div>
            
  //     <div className="flex flex-wrap justify-center gap-8 mt-16"></div>  
  //     {/* Review Statistics */}
  //     <div className="flex flex-wrap justify-center gap-6 mb-20 px-4">
  //       <div className="flex items-center justify-center text-white rounded-[0.6rem] w-80 h-24 shadow-md sm:w-64 sm:h-20 md:w-80 md:h-24" style={{ background: 'linear-gradient(90deg, #047D72 0%, #014B44 100%)' }}>
  //         <div className="flex items-center gap-2">
  //           <p className="font-outfit font-extrabold text-2xl sm:text-xl md:text-2xl">{stats.fiveStarCount}</p>
  //           <p className="font-outfit font-semibold text-2xl sm:text-lg md:text-2xl">Five Star Reviews</p>
  //         </div>
  //       </div>
        
  //       <div className="flex items-center justify-center text-white rounded-[0.6rem] w-80 h-24 shadow-md sm:w-64 sm:h-20 md:w-80 md:h-24" style={{ background: 'linear-gradient(90deg, #047D72 0%, #014B44 100%)' }}>
  //         <div className="flex items-center gap-2">
  //           <p className="font-outfit font-extrabold text-2xl sm:text-xl md:text-2xl">{stats.averageRating.toFixed(1)}</p>
  //           <div className="text-secondary p-3 rounded-full">
  //             <FaStar size={24} />
  //           </div>
  //           <p className="font-outfit font-semibold text-2xl sm:text-lg md:text-2xl">Average Rating</p>
  //         </div>
  //       </div>
  //     </div>

  //     <h2 className="text-[2.5rem] ml-10">Patient Reviews</h2>
      
  //     {reviews.length === 0 ? (
  //       <div className="bg-gray-50 p-6 rounded-lg text-center mx-4">
  //         <p className="text-lg text-gray-600">No reviews available for this doctor yet.</p>
  //       </div>
  //     ) : (
  //       <>
  //         <div className="space-y-4 px-4">
  //           {reviews.map((review) => (
  //             <div 
  //               key={review._id} 
  //               className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:border-[#02968A]"
  //             >
  //               <div className="flex justify-between items-center mb-3">
  //                 <h3 className="font-semibold text-gray-800">{review.patientName}</h3>
  //                 <div className="flex items-center">
  //                   {renderStars(review.rating)}
  //                   <span className="ml-2 text-gray-600">({review.rating})</span>
  //                 </div>
  //               </div>
                
  //               {review.review ? (
  //                 <p className="text-gray-600">{review.review}</p>
  //               ) : (
  //                 <div className="h-6"></div> // Empty space when no review text
  //               )}
                
  //               <div className="text-right mt-2">
  //                 <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
  //               </div>
  //             </div>
  //           ))}
  //         </div>

  //         {/* Pagination */}
  //         {totalPages > 1 && (
  //           <div className="flex justify-center mt-8">
  //             <nav className="flex items-center space-x-2">
  //               <button
  //                 onClick={() => handlePageChange(currentPage - 1)}
  //                 disabled={currentPage === 1}
  //                 className={`px-3 py-1 rounded ${
  //                   currentPage === 1 
  //                     ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
  //                     : 'bg-gray-100 text-gray-800 hover:bg-[#02968A] hover:text-white'
  //                 }`}
  //               >
  //                 Previous
  //               </button>
                
  //               {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
  //                 <button
  //                   key={page}
  //                   onClick={() => handlePageChange(page)}
  //                   className={`px-3 py-1 rounded ${
  //                     currentPage === page
  //                       ? 'bg-[#02968A] text-white'
  //                       : 'bg-gray-100 text-gray-800 hover:bg-[#02968A] hover:text-white'
  //                   }`}
  //                 >
  //                   {page}
  //                 </button>
  //               ))}
                
  //               <button
  //                 onClick={() => handlePageChange(currentPage + 1)}
  //                 disabled={currentPage === totalPages}
  //                 className={`px-3 py-1 rounded ${
  //                   currentPage === totalPages
  //                     ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
  //                     : 'bg-gray-100 text-gray-800 hover:bg-[#02968A] hover:text-white'
  //                 }`}
  //               >
  //                 Next
  //               </button>
  //             </nav>
  //           </div>
  //         )}
  //       </>
  //     )}
  //   </div>
  // );
};

export default DocReviews;