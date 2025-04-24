import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Post from "@/Components/psync/PostComponent";
import PsyncTopBar from "@/Components/psync/PsyncTopBar";
import FavouritesBackButton from "./FavouritesBackButton";

const SearchResults = () => {
  const [searchResults, setSearchResults] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const [refresh, setRefresh] = useState(false);

  // Extract the first part of the pathname (i.e., "doctor" or "patient")
  const role = location.pathname.split("/")[1];

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);

      // Get search query from URL
      const queryParams = new URLSearchParams(location.search);
      const seriesTitle = queryParams.get("seriesTitle");

        

  // Extract the first part of the pathname (i.e., "doctor" or "patient")
 

      if (!seriesTitle) {
        setError("No search term provided");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/api/psync/series/title/${encodeURIComponent(seriesTitle)}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch search results");
        }

        const data = await response.json();
        console.log("Search Results:", data);
        setSearchResults(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setError(error instanceof Error ? error.message : "An unknown error occurred");
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [location.search, refresh]);

  return (
    <div className="flex justify-center mt-12 bg-secondary custom-scrollbar">
      <div className="w-[95%] p-6 rounded-lg h-screen">
        <div className="pt-3 max-w-4xl w-full mx-auto">
          <PsyncTopBar setRefresh={setRefresh} />

          <FavouritesBackButton text="back to home" />
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4">
              Search Results for: <span className="text-teal-600">{new URLSearchParams(location.search).get("seriesTitle")}</span>
            </h2>

            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading search results...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500">{error}</p>
              </div>
            ) : !searchResults.posts || searchResults.posts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No series found with this title. Try another search term.</p>
              </div>
            ) : (
              <div>
                <div className="bg-teal-50 rounded-lg p-4 mb-6">
                  <h3 className="text-xl font-semibold text-teal-700">{searchResults.title}</h3>
                  <p className="text-gray-600 mt-2">{searchResults.description || "No description available"}</p>
                </div>

                <h4 className="text-lg font-medium mb-4">Posts in this series ({searchResults.posts.length}):</h4>

                {searchResults.posts.map((post: any) => (
                  <Post
                    key={post._id}
                    postId={post._id}
                    seriesTitle={searchResults.title}
                    authorId={searchResults.createdBy?._id}
                    authorName={searchResults.createdBy?.name || "Unknown"}
                    authoreRole={role}
                    authorImage="/src/assets/shared/abbad.png"
                    content={post.description}
                    timeAgo="7d ago"
                    likes={post.likes?.length || 0}
                    comments={post.comments?.length || 0}
                    title={post.title}
                    image={post.img || undefined}
                  />
                ))}

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;