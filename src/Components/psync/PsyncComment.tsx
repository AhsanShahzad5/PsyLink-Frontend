import React, { useState, useEffect } from "react";

interface Comment {
  _id: string;
  userId: string;
  comment: string;
}

interface UserDetails {
  _id: string;
  name: string;
  email: string;
}

const CommentItem: React.FC<{ comment: Comment & { userDetails: UserDetails | null } }> = ({ comment }) => {
  return (
    <div className="flex items-start space-x-4 py-4 border-b border-gray-200">
      {/* User Avatar Placeholder */}
      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
        {comment.userDetails?.name.charAt(0).toUpperCase()}
      </div>

      {/* Comment Content */}
      <div>
        <h4 className="font-bold text-gray-900">{comment.userDetails?.name || "Unknown User"}</h4>
        <p className="text-gray-700 mt-1">{comment.comment}</p>
      </div>
    </div>
  );
};

const CommentsSection: React.FC<{ postId: string }> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsWithUserDetails, setCommentsWithUserDetails] = useState<
    (Comment & { userDetails: UserDetails | null })[]
  >([]);
  const [loading, setLoading] = useState(true);

  // Fetch comments for the post
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/api/psync/getPostComments/${postId}`);
        if (response.ok) {
          const data: Comment[] = await response.json();
          setComments(data);
        }
      } catch (err) {
        console.error("Error fetching comments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

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

  return (
    <div className="mt-4">
      {loading ? (
        <p className="text-gray-500 italic">Loading comments...</p>
      ) : commentsWithUserDetails.length > 0 ? (
        commentsWithUserDetails.map((comment) => <CommentItem key={comment._id} comment={comment} />)
      ) : (
        <p className="text-gray-500 italic">No comments yet.</p>
      )}
    </div>
  );
};

export default CommentsSection;
