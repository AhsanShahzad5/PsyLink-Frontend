import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Post from "../../Components/psync/PostComponent";
import { Card } from "@/Components/ui/card";
import FavouritesBackButton from "@/Components/psync/FavouritesBackButton";

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
  const { seriesId } = useParams(); // React Router's way to get URL parameters
  //const { seriesId } = useParams(); // Not { id }
console.log("ID from URL:", seriesId); // Debugging line to check the ID
const location = useLocation();
const navigate = useNavigate();


// Extract the first part of the pathname (i.e., "doctor" or "patient")
const role = location.pathname.split("/")[1];

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
        console.log("Fetched inidivdual series data:", data);
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
  }, [seriesId]); // Re-fetch when ID changes

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

  const handleViewFullPostPage = (postId:any)=>{
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
           
            {/* <h1 className="text-3xl font-bold text-gray-800" onClick={handleViewFullPostPage}>{series.title}</h1> */}
           
           
            <h1 className="text-3xl font-bold text-gray-800">{series.title}</h1>
           
           
            <p className="text-gray-500 text-sm">
              Created by {series.createdBy?.name || "Unknown"} • {getTimeAgo(series.createdAt)}
            </p>
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
    </div>
  );
};

export default SeriesPage;