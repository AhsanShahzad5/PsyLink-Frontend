import { Card, CardContent, CardFooter } from "@/Components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import userAtom from "@/atoms/userAtom";
import { useRecoilValue } from "recoil";
import CommentsSection from "./PsyncComment";

interface PostData {
  authorName: string;
  authorImage?: string;
  content: string;
  timeAgo: string;
  likes: number;
  comments: number;
  image?: string;
  title?: string;
  postId: string;
}

const FullPost = () => {
  const { postId } = useParams();
  const user = useRecoilValue(userAtom);
  const userId = user?._id;
  
  const [post, setPost] = useState<PostData | null>(null);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch the full post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/psync/post/${postId}`);
        const result = await response.json();
        if (response.ok) {
          setPost(result);
          setLikeCount(result.likes);
          setCommentCount(result.comments);
        } else {
          console.error("Error fetching post:", result.error);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  // Handle like action
  const handleLike = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/psync/likeUnlikePost/${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const result = await response.json();
      if (response.ok) {
        setLikeCount((prev) => (result.message === "Post unliked successfully" ? prev - 1 : prev + 1));
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error("Error liking/unliking post:", error);
    }
  };

  // Handle favorite action
  const handleFavorite = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/psync/${postId}/favorite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        setIsFavorited(true);
      } else {
        console.error("Error adding to favorites.");
      }
    } catch (error) {
      console.error("Error adding to favorites:", error);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading post...</div>;

  if (!post) return <div className="text-center mt-10 text-red-500">Post not found</div>;

  return (
    <Card className="mt-6 bg-white rounded-lg overflow-hidden shadow-lg max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="flex items-start gap-3 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={post.authorImage} alt={post.authorName} />
            <AvatarFallback className="bg-teal-600 text-white">{post.authorName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{post.authorName}</h3>
            <p className="text-sm text-gray-500">{post.timeAgo}</p>
          </div>
        </div>

        {post.title && <h1 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h1>}
        <p className="text-gray-700 text-base leading-relaxed">{post.content}</p>

        {post.image && (
          <div className="mt-4 rounded-lg overflow-hidden">
            <img src={post.image} alt="Post" className="w-full h-auto object-cover" />
          </div>
        )}

        <div className="text-sm text-gray-500 mt-4">
          {likeCount} Likes • {commentCount} Comments
        </div>
      </CardContent>

      <CardFooter className="border-t border-gray-100 p-3 flex justify-between">
        <button
          onClick={handleLike}
          className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-full hover:bg-teal-700 transition"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          Like
        </button>

        <button
          onClick={handleFavorite}
          className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-full hover:bg-teal-700 transition"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
          </svg>
          Favorite
        </button>
      </CardFooter>

      {/* Comments Section */}
      <div className="p-6">
        <CommentsSection postId={postId || ''} />
      </div>
    </Card>
  );
};

export default FullPost;
