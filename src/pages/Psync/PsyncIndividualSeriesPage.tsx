import { useEffect, useState } from "react";
import Post from "../../Components/psync/PostComponent"; // Using your existing Post component
import { Card } from "@/Components/ui/card";
import FavouritesBackButton from "@/Components/psync/FavouritesBackButton";

// Define interfaces for our data types
interface PostItem {
  id: number;
  authorName: string;
  authorRole: string;
  authorImage: string;
  title: string;
  content: string;
  timeAgo: string;
  likeCount: number;
  commentCount: number;
}

interface SeriesItem {
  id: number;
  title: string;
  posts: PostItem[];
}

const SeriesPage = () => {
  const [series, setSeries] = useState<SeriesItem | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Mock data for demonstration
  useEffect(() => {
    // Simulate fetching series data
    const fetchSeries = async () => {
      // Just showing one series with its posts (Mental Health Awareness)
      const mockSeries: SeriesItem = {
        id: 1,
        title: "Mental Health Awareness",
        posts: [
          {
            id: 101,
            authorName: "Dr. Smith",
            authorRole: "doctor",
            authorImage: "/api/placeholder/40/40",
            title: "Understanding Anxiety",
            content: "Anxiety is a normal emotion that everyone experiences at times. Many people feel anxious, or nervous, when faced with a problem at work, before taking a test, or making an important decision...",
            timeAgo: "2 days ago",
            likeCount: 24,
            commentCount: 5
          },
          {
            id: 102,
            authorName: "Dr. Smith",
            authorRole: "doctor",
            authorImage: "/api/placeholder/40/40",
            title: "Managing Depression",
            content: "Depression is more than just feeling sad. It's a serious mental health condition that requires understanding and medical care...",
            timeAgo: "5 days ago",
            likeCount: 31,
            commentCount: 8
          },
          {
            id: 105,
            authorName: "Dr. Smith",
            authorRole: "doctor",
            authorImage: "/api/placeholder/40/40",
            title: "Managing Depression",
            content: "Depression is more than just feeling sad. It's a serious mental health condition that requires understanding and medical care...",
            timeAgo: "5 days ago",
            likeCount: 31,
            commentCount: 8
          },
          {
            id: 106,
            authorName: "Dr. Smith",
            authorRole: "doctor",
            authorImage: "/api/placeholder/40/40",
            title: "Managing Depression",
            content: "Depression is more than just feeling sad. It's a serious mental health condition that requires understanding and medical care...",
            timeAgo: "5 days ago",
            likeCount: 31,
            commentCount: 8
          },
        ]
      };
      
      setSeries(mockSeries);
      setLoading(false);
    };

    fetchSeries();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-secondary">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
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

  return (
    <div className=" bg-secondary min-h-screen pb-10 mt-[5rem]  flex flex-col justify-center align-middle w-full max-w-[90rem]">
      {/* Back Button with Title */}
      <div className="p-3 ml-3">
      <FavouritesBackButton text="All Series" />

      </div>
      
      {/* Content Container */}
      <div className="mx-4 mt-3 w-full ">
        {/* Series Card with Title and Posts */}
        <Card className="bg-gray-50 rounded-lg overflow-hidden">
          {/* Series Title Section */}
          <div className="p-4 pb-1 border-r border-gray-100">
            <h1 className="text-3xl font-bold text-gray-800">{series.title}</h1>
          </div>
          
          {/* Posts Section */}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 gap-x-10 p-4  ">
            {series.posts.map((post) => (
              <div key={post.id} className="w-full ">
                <Post 
                  postId={post.id.toString()}
                  authoreRole={post.authorRole}
                  authorName={post.authorName}
                  authorImage={post.authorImage}
                  content={post.content}
                  timeAgo={post.timeAgo}
                  likes={post.likeCount}
                  comments={post.commentCount}
                  title={post.title}
                  seriesTitle={series.title}
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