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

const CommentsSection: React.FC<{ postId: string }> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsWithUserDetails, setCommentsWithUserDetails] = useState<
    (Comment & { userDetails: UserDetails | null })[]
  >([]);
  const [loading, setLoading] = useState(true); // ✅ Track loading state

  // ✅ Fetch comments when `postId` changes
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8000/api/psync/getPostComments/${postId}`
        );
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
  }, [postId]); // ✅ Only run when `postId` changes

  // ✅ Fetch user details when `comments` change
  useEffect(() => {
    if (comments.length === 0) return;

    const fetchUserDetailsForComments = async () => {
      try {
        const updatedComments = await Promise.all(
          comments.map(async (comment) => {
            try {
              const response = await fetch(
                `http://localhost:8000/api/user/userDetails/${comment.userId}`
              );
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
  }, [comments]); // ✅ Only run when `comments` change

  return (
    <div className="mt-4">
      {loading ? (
        <p className="text-gray-500 italic">Loading comments...</p>
      ) : commentsWithUserDetails.length > 0 ? (
        commentsWithUserDetails.map((comment) => (
          <div
            key={comment._id}
            className="flex items-start space-x-3 border-b border-gray-200 py-3"
          >
            <div>
              <h4 className="font-bold text-gray-800">
                {comment.userDetails?.name || "Unknown User"}
              </h4>
              <p className="text-sm text-gray-500">
                {comment.userDetails?.email || "No email"}
              </p>
              <p className="text-gray-700 mt-1">{comment.comment}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 italic">No comments yet.</p>
      )}
    </div>
  );
};

export default CommentsSection;
