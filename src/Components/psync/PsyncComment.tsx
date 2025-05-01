import React, { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar";

interface Comment {
  _id: string;
  userId: string;
  comment: string;
  createdAt?: string; // Add timestamp for sorting
}

interface UserDetails {
  _id: string;
  name: string;
  email: string;
  profilePicture: string | null;
}

// Import the LoadingSpinner component
export const LoadingSpinner = ({text}) => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    <span className="ml-3 text-lg text-gray-600">{text}</span>
  </div>
);

const CommentItem: React.FC<{ comment: Comment & { userDetails: UserDetails | null } }> = ({ comment }) => {
  return (
    <div className="flex items-start space-x-4 py-4 border-b border-gray-200">
      <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
        <AvatarImage src={comment.userDetails?.profilePicture || undefined} alt={comment.userDetails?.name || "User"} />
        <AvatarFallback className="bg-teal-600 text-white">
          {comment.userDetails?.name ? comment.userDetails.name.charAt(0).toUpperCase() : "U"}
        </AvatarFallback>
      </Avatar>
      <div>
        <h4 className="font-bold text-gray-900">{comment.userDetails?.name || "Unknown User"}</h4>
        <p className="text-gray-700 mt-1">{comment.comment}</p>
      </div>
    </div>
  );
};

interface CommentsSectionProps {
  postId: string;
  newComment?: Comment | null; // Optional prop to receive new comments from parent
  onCommentAdded?: () => void; // Optional callback to notify parent component
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ postId, newComment, onCommentAdded }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsWithUserDetails, setCommentsWithUserDetails] = useState<
    (Comment & { userDetails: UserDetails | null })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [updateTrigger, setUpdateTrigger] = useState(0); // Used to trigger re-fetching

  // Fetch comments for the post
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/api/psync/getPostComments/${postId}`);
        if (response.ok) {
          const data: Comment[] = await response.json();
          
          // Sort comments by creation date if available (newest first)
          const sortedData = data.sort((a, b) => {
            if (!a.createdAt || !b.createdAt) return 0;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
          
          setComments(sortedData);
        }
      } catch (err) {
        console.error("Error fetching comments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId, updateTrigger]); // Re-fetch when updateTrigger changes

  // Handle new comment from parent component
  useEffect(() => {
    if (newComment && newComment._id) {
      setUpdateTrigger(prev => prev + 1); // Trigger a re-fetch instead of manually adding
      
      if (onCommentAdded) {
        onCommentAdded();
      }
    }
  }, [newComment, onCommentAdded]);

  // Fetch user details for each comment
  useEffect(() => {
    if (comments.length === 0) return;

    const fetchUserDetailsForComments = async () => {
      try {
        const updatedComments = await Promise.all(
          comments.map(async (comment) => {
            try {
              const response = await fetch(`http://localhost:8000/api/user/userDetails/${comment.userId}`);
              const userDetails = response.ok ? await response.json() : null;
              return { ...comment, userDetails };
            } catch (err) {
              console.error("Error fetching user details:", err);
              return { ...comment, userDetails: null };
            }
          })
        );
        
        setCommentsWithUserDetails(updatedComments);
      } catch (err) {
        console.error("Error processing comments:", err);
      }
    };

    fetchUserDetailsForComments();
  }, [comments]);

  // Function that can be called to refresh comments
  const refreshComments = () => {
    setUpdateTrigger(prev => prev + 1);
  };

  return (
    <div className="mt-4">
      {loading ? (
        <LoadingSpinner text="Loading comments..." />
      ) : commentsWithUserDetails.length > 0 ? (
        commentsWithUserDetails.map((comment) => <CommentItem key={comment._id} comment={comment} />)
      ) : (
        <p className="text-gray-500 italic">No comments yet.</p>
      )}
    </div>
  );
};

export default CommentsSection;