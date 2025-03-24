import React, { useEffect, useState } from "react";
import Post from "@/Components/psync/PostComponent";
import PsyncTopBar from "@/Components/psync/PsyncTopBar";


const Psync = () => {
  const [posts, setPosts] = useState<any[]>([]); // Store posts data
  const [loading, setLoading] = useState(true); // Track loading state
  const [refresh, setRefresh] = useState(false);
  
  //const [posts, setPosts] = useRecoilState(postsAtom);


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
  }, [refresh]); // Empty dependency array ensures this runs only once

  return (
    <div className="flex justify-center mt-12 bg-secondary custom-scrollbar">
      <div className="w-[95%] p-6 rounded-lg h-screen">
        <div className="pt-3 max-w-4xl w-full mx-auto">
          <PsyncTopBar setRefresh={setRefresh} />
          {
          loading ? (
            <p className="text-center text-gray-600">Loading posts...</p>
          ) : posts.length === 0 ? (
            <p className="text-center text-gray-600">No posts available</p>
          ) : (
            posts.map((post) => (
              <Post
                    key={post._id} // Use unique key for each post
                    postId={post._id}
                    authorName={post.user?.name || "Unknown"} // Use user name or fallback
                    authoreRole={post.user?.role || "unknown"} // Use user role or fallback
                    authorImage="/src/assets/shared/abbad.png" // Replace with dynamic image if available
                    content={post.description} // Post description
                    timeAgo="7d ago" // Placeholder for dynamic time
                    likes={post.likes?.length || 0} // Total likes
                    comments={post.comments?.length || 0} // Total comments
                    title={post.title} // Post title
                    image={post.img || undefined} // Optional image field
                    />
            ))
          )
          }
        </div>
      </div>
    </div>
  );
};

export default Psync;
