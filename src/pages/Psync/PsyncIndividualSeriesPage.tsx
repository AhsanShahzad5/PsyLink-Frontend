import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Post from "../../Components/psync/PostComponent";
import { Card } from "@/Components/ui/card";
import FavouritesBackButton from "@/Components/psync/FavouritesBackButton";
import PostModal from "../../Components/psync/PsyncPostCreationModal";
import { Pencil, Trash2 } from "lucide-react";
import { useRecoilValue } from "recoil";
import userAtom from "@/atoms/userAtom";

// Define interfaces for our data types
interface PostItem {
  _id: string;
  title: string;
  description: string;
  img: string;
  userId: string;
  likes: string[];
  favouritedBy: string[];
  series: string[];
  comments: any[];
  createdAt: string;
  updatedAt: string;
}

interface UserInfo {
  _id: string;
  name: string;
  email: string;
}

interface SeriesItem {
  _id: string;
  title: string;
  posts: PostItem[];
  createdBy: UserInfo;
  createdAt: string;
  updatedAt: string;
}

const SeriesPage = () => {
  const [series, setSeries] = useState<SeriesItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { seriesId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const user = useRecoilValue(userAtom);

  // Extract the first part of the pathname (i.e., "doctor" or "patient")
  const role = location.pathname.split("/")[1];

  // Check if logged in user is the creator of the series
  const isCreator = user && series?.createdBy?._id === user._id;

  useEffect(() => {
    const fetchSeries = async () => {
      // Only fetch if we have an ID
      if (!seriesId) return;
      
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/api/psync/series/${seriesId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Fetched individual series data:", data);
        setSeries(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching series data:", err);
        setError("Failed to load series data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSeries();
  }, [seriesId, refresh]); // Re-fetch when ID changes or refresh state changes

  // Handle series deletion
  const handleDeleteSeries = async () => {
    if (!seriesId || !user) return;
    
    try {
      setIsDeleting(true);
      
      const response = await fetch(`http://localhost:8000/api/psync/series/${seriesId}/with-posts`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user._id }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }
      
      // Close modal and navigate back to series list
      setIsDeleteModalOpen(false);
      navigate(-1);
      
    } catch (err: any) {
      console.error("Error deleting series:", err);
      setError(`Failed to delete series: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-secondary">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-secondary">
        <h2 className="text-2xl font-bold text-gray-800">Error</h2>
        <p className="text-gray-600 mt-2">{error}</p>
      </div>
    );
  }

  if (!series) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-secondary">
        <h2 className="text-2xl font-bold text-gray-800">Series not found</h2>
      </div>
    );
  }

  // Calculate time ago function
  const getTimeAgo = (dateString:any) => {
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

  const handleViewFullPostPage = (postId:any) => {
    navigate(`/${role}/psync/post/${postId}`);
  }

  return (
    <div className="bg-secondary min-h-screen pb-10 mt-20 flex flex-col justify-center align-middle w-full max-w-6xl mx-auto">
      {/* Back Button with Title */}
      <div className="p-3 ml-3">
        <FavouritesBackButton text="All Series" />
      </div>
      
      {/* Content Container */}
      <div className="mx-4 mt-3 w-full">
        {/* Series Card with Title and Posts */}
        <Card className="bg-gray-50 rounded-lg overflow-hidden">
          {/* Series Title Section */}
          <div className="p-4 pb-1 border-r border-gray-100">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-800">{series.title}</h1>
              
              {/* Series Actions - Only shown for creator */}
              {isCreator && (
                <div className="flex items-center gap-2">
                  {/* Delete Button */}
                  <button 
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition flex items-center gap-1"
                    onClick={() => setIsDeleteModalOpen(true)}
                  >
                    <Trash2 size={20} />
                    <span className="text-sm font-medium hidden sm:inline">Delete Series</span>
                  </button>
                </div>
              )}
            </div>
            <p className="text-gray-500 text-sm">
              Created by {series.createdBy?.name || "Unknown"} • {getTimeAgo(series.createdAt)}
            </p>

            {/* Add Post Button - Only visible to series creator */}
            {isCreator && (
              <button 
                onClick={() => setIsPostModalOpen(true)}
                className="mt-3 flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-full text-sm transition"
              >
                {/* Plus icon */}
                <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5a1 1 0 0 1 1-1z" />
                </svg>
                <span>Add Post</span>
              </button>
            )}
          </div>
          
          {/* Posts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 gap-x-10 p-4">
            {series.posts.map((post) => (
              <div key={post._id} className="w-full">
                <Post 
                  postId={post._id}
                  authoreRole={role}
                  authorName={series.createdBy?.name || "Unknown"}
                  authorImage={"/api/placeholder/40/40"}
                  content={post.description}
                  timeAgo={getTimeAgo(post.createdAt)}
                  likes={post.likes.length}
                  comments={post.comments.length}
                  title={post.title}
                  seriesTitle={series.title}
                  image={post.img || undefined} // Optional image field
                />
              </div>
            ))}
          </div>
        </Card>
        
        {/* No posts message */}
        {series.posts.length === 0 && (
          <div className="text-center mt-10 p-6 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">No posts in this series yet.</p>
          </div>
        )}
      </div>

      {/* Post Creation Modal - With pre-selected series */}
      {isPostModalOpen && (
        <PostModal
          isOpen={isPostModalOpen}
          onClose={() => setIsPostModalOpen(false)}
          setRefresh={setRefresh}
          preSelectedSeries={series ? { id: series._id, name: series.title } : undefined}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Series</h3>
            
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <div className="flex items-start">
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    <strong>Warning:</strong> This will permanently delete the series "{series.title}" and all {series.posts.length} posts within it. This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSeries}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition flex items-center"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  <>Delete Permanently</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeriesPage;