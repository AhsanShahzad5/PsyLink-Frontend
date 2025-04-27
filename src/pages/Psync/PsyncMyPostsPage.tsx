import  { useEffect, useState } from "react";
import Post from "@/Components/psync/PostComponent";
import userAtom from "@/atoms/userAtom";
import { useRecoilValue } from "recoil";
import FavouritesBackButton from "@/Components/psync/FavouritesBackButton";
import { toast } from "@/hooks/use-toast";
import useUserDetails from "@/hooks/useUserDetails";


const Psync = () => {
  const [posts, setPosts] = useState<any[]>([]); // Store posts data
  const [loading, setLoading] = useState(true); // Track loading state
  const [refresh, setRefresh] = useState(false);
  
  //const [posts, setPosts] = useRecoilState(postsAtom);
const user = useRecoilValue(userAtom);
const userId = user?._id;

const { user:userDetails } = useUserDetails(userId);
console.log("User Details are:", userDetails); // Log the user details

useEffect(() => {
    // Fetch posts from the backend
    const fetchPosts = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/psync/getMyPosts?userId=${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Include cookies
        });

      
        const data = await response.json();
        console.log("Fetched Posts:", data); // Log the fetched posts
        setPosts(data); // Set posts correctly
        setLoading(false); // Mark loading as complete
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false); // Stop loading even if there's an error
      }
    };
  
    fetchPosts();
  }, [refresh]); 
  
  

  return (
    <div className="flex justify-center mt-12 bg-secondary">
      <div className="w-[95%] p-6 rounded-lg shadow-lg overflow-auto h-screen custom-scrollbar">
        <div className="pt-3 max-w-4xl w-full mx-auto">
        <FavouritesBackButton text="My Posts"/>
          {
          loading ? (
            <p className="text-center text-gray-600">Loading posts...</p>
          ) : posts.length === 0 ? (
            <p className="text-center text-gray-600">No posts available</p>
          ) : (
            posts?.map((post) => (
              <Post
                    key={post._id} // Use unique key for each post
                    postId={post._id}
                    seriesTitle= {post.series[0]?.title || "no series"} // Series title
                    authoreRole={user?.role || "Unknown"} // Use user role or fallback
                    authorId={post?.userId || "unknown"} // Use user ID or fallback
                    authorName={user.name || "Unknown"} // Use user name or fallback
                    authorImage={userDetails?.profilePicture || ""} // Replace with dynamic image if available
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
