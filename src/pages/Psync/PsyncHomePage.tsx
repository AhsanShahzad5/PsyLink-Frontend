import { useEffect, useState } from "react";
import Post from "@/Components/psync/PostComponent";
import PsyncTopBar from "@/Components/psync/PsyncTopBar";
import { useLocation } from "react-router-dom";

const Psync = () => {
  const [posts, setPosts] = useState<any[]>([]); // Store posts data
  const [loading, setLoading] = useState(true); // Track loading state
  const [refresh, setRefresh] = useState(false);
   // Extract the first part of the pathname (i.e., "doctor" or "patient")
   const location = useLocation();
   const roleOfLoggedInUser = location.pathname.split("/")[1];
  //const [posts, setPosts] = useRecoilState(postsAtom);
  useEffect(() => {
    // Fetch posts from the backend
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/psync/getAllPosts"); // Replace with your API URL
        const data = await response.json();
        console.table("Fetched Posts:", data); // Log the fetched posts
        setPosts(data); // Update state with fetched posts
        setLoading(false); // Mark loading as complete
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, [refresh]); // Empty dependency array ensures this runs only once

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

  return (
    <div className="flex justify-center mt-4 md:mt-8 lg:mt-12 bg-secondary custom-scrollbar min-h-screen w-full px-2 sm:px-4">
      <div className="w-full max-w-7xl p-2 sm:p-4 md:p-6 rounded-lg">
        <div className="pt-2 md:pt-3 w-full mx-auto max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
          <PsyncTopBar setRefresh={setRefresh} />
          <div className="space-y-4 mt-4">
            {loading ? (
              <p className="text-center text-gray-600 py-8">Loading posts...</p>
            ) : posts.length === 0 ? (
              <p className="text-center text-gray-600 py-8">No posts available</p>
            ) : (
              posts.map((post) => (
                <Post
                  key={post._id} // Use unique key for each post
                  postId={post._id}
                  seriesTitle={post.series[0]?.title || "no series"} // Series title
                  authorId={post.user?._id || "unknown"} // Use user ID or fallback
                  authorName={post.user?.name || "Unknown"} // Use user name or fallback
                  authoreRole={post.user?.role || "unknown"} // Use user role or fallback
                  authorImage={ post.user?.profilePicture || ""} // Replace with dynamic image if available
                  content={post.description} // Post description
                  timeAgo={getTimeAgo(post.createdAt) || "7d ago"} // Placeholder for dynamic time
                  likes={post.likes?.length || 0} // Total likes
                  comments={post.comments?.length || 0} // Total comments
                  title={post.title} // Post title
                  image={post.img || undefined} // Optional image field
                  roleOfLoggedInUser={roleOfLoggedInUser} // Role of the logged-in user
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Psync;