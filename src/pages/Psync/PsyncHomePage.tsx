import React, { useEffect, useState } from "react";
import Post from "@/Components/psync/PostComponent";
import PsyncSearchbar from "@/Components/psync/PsyncSearchbar";

const Psync = () => {
  const [posts, setPosts] = useState<any[]>([]); // Store posts data
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    // Fetch posts from the backend
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/psync/getAllPosts"); // Replace with your API URL
        const data = await response.json();
        console.log("Fetched Posts:", data); // Log the fetched posts
        setPosts(data); // Update state with fetched posts
        setLoading(false); // Mark loading as complete
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [posts]); // Empty dependency array ensures this runs only once

  return (
    <div className="flex justify-center mt-6 bg-secondary">
      <div className="w-[95%] p-6 bg-white rounded-lg shadow-lg overflow-auto h-screen custom-scrollbar">
        <div className="pt-3 max-w-4xl w-full mx-auto">
          <PsyncSearchbar />
          {loading ? (
            <p className="text-center text-gray-600">Loading posts...</p>
          ) : posts.length === 0 ? (
            <p className="text-center text-gray-600">No posts available</p>
          ) : (
            posts.map((post) => (
              <Post
                    key={post._id} // Use unique key for each post
                    postId={post._id}
                    authorName={post.user?.name || "Unknown"} // Use user name or fallback
                    authorImage="/src/assets/shared/abbad.png" // Replace with dynamic image if available
                    content={post.description} // Post description
                    timeAgo="7d ago" // Placeholder for dynamic time
                    likes={post.likes?.length || 0} // Total likes
                    comments={post.comments?.length || 0} // Total comments
                    title={post.title} // Post title
                    image={post.img || undefined} // Optional image field
                    />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Psync;
