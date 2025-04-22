import FavouritesBackButton from "@/Components/psync/FavouritesBackButton";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar";
import { Card, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";

// Define the interfaces for the data structures
interface Post {
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
  posts: Post[];
}

interface HoveredPostData {
  post: Post;
  seriesTitle: string;
}

const PsyncSeries = () => {
  const navigate = useNavigate();
  const [series, setSeries] = useState<SeriesItem[]>([]);
  const [hoveredPost, setHoveredPost] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const hoverTimeoutRef = useRef<number | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const postRefs = useRef<{ [key: number]: HTMLElement }>({});
  
  // Mock data for demonstration - replace with actual API call
  useEffect(() => {
    // Simulate fetching series data
    const fetchSeries = async () => {
      // Replace with actual API call
      const mockSeries: SeriesItem[] = [
        {
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
            }
          ]
        },
        {
          id: 2,
          title: "Physical Wellness",
          posts: [
            {
              id: 201,
              authorName: "Jane Doe",
              authorRole: "patient",
              authorImage: "/api/placeholder/40/40",
              title: "My Exercise Journey",
              content: "I've been on a journey to improve my physical health for the past 6 months. Starting with simple walks and gradually building up to more intense workouts...",
              timeAgo: "1 day ago",
              likeCount: 18,
              commentCount: 3
            },
            {
              id: 202,
              authorName: "Dr. Johnson",
              authorRole: "doctor",
              authorImage: "/api/placeholder/40/40",
              title: "Benefits of Regular Exercise",
              content: "Regular physical activity is one of the most important things you can do for your health. Being physically active can improve your brain health, help manage weight, reduce the risk of disease...",
              timeAgo: "3 days ago",
              likeCount: 42,
              commentCount: 7
            },
            {
              id: 205,
              authorName: "Dr. Johnson",
              authorRole: "doctor",
              authorImage: "/api/placeholder/40/40",
              title: "Benefits of Regular Exercise",
              content: "Regular physical activity is one of the most important things you can do for your health. Being physically active can improve your brain health, help manage weight, reduce the risk of disease...",
              timeAgo: "3 days ago",
              likeCount: 42,
              commentCount: 7
            },
            {
              id: 206,
              authorName: "Dr. Johnson",
              authorRole: "doctor",
              authorImage: "/api/placeholder/40/40",
              title: "Benefits of Regular Exercise",
              content: "Regular physical activity is one of the most important things you can do for your health. Being physically active can improve your brain health, help manage weight, reduce the risk of disease...",
              timeAgo: "3 days ago",
              likeCount: 42,
              commentCount: 7
            },
            {
              id: 207,
              authorName: "Dr. Johnson",
              authorRole: "doctor",
              authorImage: "/api/placeholder/40/40",
              title: "Benefits of Regular Exercise",
              content: "Regular physical activity is one of the most important things you can do for your health. Being physically active can improve your brain health, help manage weight, reduce the risk of disease...",
              timeAgo: "3 days ago",
              likeCount: 42,
              commentCount: 7
            },
            {
              id: 208,
              authorName: "Jane Doe",
              authorRole: "patient",
              authorImage: "/api/placeholder/40/40",
              title: "Healthy Eating Habits",
              content: "Developing healthy eating habits isn't as confusing or restrictive as many people imagine. The essential steps are to eat mostly foods derived from plants and limit highly processed foods...",
              timeAgo: "6 days ago",
              likeCount: 27,
              commentCount: 4
            }
          ]
        },
        {
          id: 3,
          title: "Recovery Stories",
          posts: [
            {
              id: 301,
              authorName: "John Smith",
              authorRole: "patient",
              authorImage: "/api/placeholder/40/40",
              title: "My Road to Recovery",
              content: "Six months ago, I was diagnosed with a condition that changed my life. Here's my journey and the lessons I've learned along the way...",
              timeAgo: "4 days ago",
              likeCount: 56,
              commentCount: 12
            }
          ]
        }
      ];
      
      setSeries(mockSeries);
    };

    fetchSeries();
  }, []);

  const handlePostClick = (postId: number, authorRole: string) => {
    navigate(`/${authorRole}/psync/post/${postId}`);
  };

  // Setup click outside listener to close the hover preview
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (previewRef.current && !previewRef.current.contains(event.target as Node)) {
        setHoveredPost(null);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  const handleMouseEnter = (postId: number, event: React.MouseEvent<HTMLDivElement>) => {
    // Clear any existing timeout to prevent flickering
    if (hoverTimeoutRef.current !== null) {
      window.clearTimeout(hoverTimeoutRef.current);
    }
    
    // Store reference to the current target element
    if (event && event.currentTarget) {
      postRefs.current[postId] = event.currentTarget;
    }
    
    // Set a small delay before showing preview to prevent accidental triggers
    hoverTimeoutRef.current = window.setTimeout(() => {
      // Use the stored reference instead of event.currentTarget
      const element = postRefs.current[postId];
      
      if (element) {
        const rect = element.getBoundingClientRect();
        setHoverPosition({
          x: rect.left + rect.width,
          y: rect.top
        });
        setHoveredPost(postId);
      }
    }, 300);
  };

  const handleMouseLeave = () => {
    // Clear timeout if mouse leaves before preview is shown
    if (hoverTimeoutRef.current !== null) {
      window.clearTimeout(hoverTimeoutRef.current);
    }
    
    // Set a small delay before hiding to prevent flickering when moving between post and preview
    hoverTimeoutRef.current = window.setTimeout(() => {
      setHoveredPost(null);
    }, 300);
  };

  // Find the hovered post data
  const getHoveredPostData = (): HoveredPostData | null => {
    if (!hoveredPost) return null;
    
    for (const seriesItem of series) {
      for (const post of seriesItem.posts) {
        if (post.id === hoveredPost) {
          return { post, seriesTitle: seriesItem.title };
        }
      }
    }
    return null;
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current !== null) {
        window.clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const hoveredPostData = getHoveredPostData();

  const hoverToIndividualSeriesPage = () => {
    //navigate(`/${hoveredPostData?.post.authorRole}/psync/series/${hoveredPostData?.post.id}`);
    navigate('/patient/psync/myseries/1');
  }

  return (
    <div className="flex justify-center mt-12 bg-secondary">
      <div className="w-full max-w-7xl p-6 rounded-lg shadow-lg  h-screen">
        <div className="pt-3 max-w-7xl w-full mx-auto">
          <FavouritesBackButton text="My Series" />
          
          <div className="mt-8 space-y-10">
            {series.map((seriesItem) => (
              <div key={seriesItem.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  {/* Series Title */}
                  <div className="md:w-1/4 bg-gray-50 p-6 flex items-center justify-center border-r border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800 hover:cursor-pointer hover:underline" onClick={hoverToIndividualSeriesPage}>{seriesItem.title}</h2>
                  </div>
                  
                  {/* Posts Preview */}
                  <div className="md:w-3/4 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {seriesItem.posts.map((post) => (
                        <div 
                          key={post.id} 
                          className="relative group"
                          onMouseEnter={(e) => handleMouseEnter(post.id, e)}
                          onMouseLeave={handleMouseLeave}
                        >
                          <div 
                            className="bg-teal-50 border border-teal-200 rounded-lg p-4 h-40 cursor-pointer 
                            transition-all duration-200 group-hover:shadow-lg group-hover:border-teal-300"
                            onClick={() => handlePostClick(post.id, post.authorRole)}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white text-sm">
                                {post.authorName[0]}
                              </div>
                              <span className="text-sm font-medium text-gray-700">{post.authorName}</span>
                              {post.authorRole === "doctor" && (
                                <Badge className="bg-transparent border border-teal-300 text-teal-600 text-xs">
                                  {post.authorRole}
                                </Badge>
                              )}
                            </div>
                            <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">{post.title}</h3>
                            <p className="text-gray-600 text-sm line-clamp-2">{post.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Fixed position preview that appears to emerge from the post box */}
      {hoveredPost !== null && hoveredPostData && (
        <div 
          ref={previewRef}
          className="fixed z-50 transition-opacity duration-300 opacity-100"
          style={{
            left: `${hoverPosition.x}px`,
            top: `${hoverPosition.y}px`,
            transform: 'translate(20px, -10px)'
          }}
          onMouseEnter={() => {
            if (hoverTimeoutRef.current !== null) {
              window.clearTimeout(hoverTimeoutRef.current);
            }
          }}
          onMouseLeave={handleMouseLeave}
        >
          <Card className="w-96 shadow-2xl border-none animate-in fade-in duration-200" onClick={(e) => e.stopPropagation()}>
            <CardContent className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={hoveredPostData.post.authorImage} alt={hoveredPostData.post.authorName} />
                  <AvatarFallback className="bg-teal-600 text-white">{hoveredPostData.post.authorName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex gap-2 items-center">
                    <h3 className="font-semibold text-lg text-gray-900">{hoveredPostData.post.authorName}</h3>
                    {hoveredPostData.post.authorRole === "doctor" && (
                      <Badge className="bg-transparent border-teal-300 text-teal-600">
                        {hoveredPostData.post.authorRole}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-teal-600">{hoveredPostData.seriesTitle}</p>
                  <p className="text-xs text-gray-500">{hoveredPostData.post.timeAgo}</p>
                </div>
              </div>
              
              <h1 className="text-xl font-bold text-gray-800 mb-3">{hoveredPostData.post.title}</h1>
              <div className="max-h-60 overflow-y-auto pr-2 mb-4">
                <p className="text-gray-700">{hoveredPostData.post.content}</p>
              </div>
              
              <div className="text-sm text-gray-500 mt-2 mb-4">
                {hoveredPostData.post.likeCount} Likes • {hoveredPostData.post.commentCount} Comments
              </div>
              
              <div className="pt-3 border-t border-gray-100">
                <div className="flex justify-between">
                  <button className="text-teal-600 flex items-center gap-1 text-sm hover:text-teal-800 transition-colors">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    Like
                  </button>
                  <button className="text-teal-600 flex items-center gap-1 text-sm hover:text-teal-800 transition-colors">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Comment
                  </button>
                  <button className="text-teal-600 flex items-center gap-1 text-sm hover:text-teal-800 transition-colors">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
                    </svg>
                    Favorite
                  </button>
                </div>
              </div>
              
              <button 
                className="w-full mt-4 bg-teal-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
                onClick={() => handlePostClick(hoveredPostData.post.id, hoveredPostData.post.authorRole)}
              >
                View Full Post
              </button>
            </CardContent>
          </Card>
          
          {/* Triangle pointer that visually connects preview to original post */}
          <div 
            className="absolute w-4 h-4 bg-white rotate-45 border-t border-l border-gray-200"
            style={{
              top: '15px',
              left: '0',
              transform: 'translateX(-50%)'
            }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default PsyncSeries;