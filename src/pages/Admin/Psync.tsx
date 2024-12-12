import Post from "@/Components/psync/PostComponent";
import PsyncSearchbar from "@/Components/psync/PsyncSearchbar";

const Psync = () => {
  return (
    <div className="flex justify-center mt-6 bg-secondary">
      <div className="w-[95%] p-6 bg-white rounded-lg shadow-lg overflow-auto h-screen custom-scrollbar">
        <div className="pt-3 max-w-4xl w-full mx-auto">
          <PsyncSearchbar />
          <Post
            authorName="Alex Russo"
            authorImage="/src/assets/shared/abbad.png"
            content="Prioritize your mental health! Join our self-care workshop and learn essential tools for self-compassion, boundary-setting, and emotional regulation"
            timeAgo="7d ago"
            likes={70}
            comments={30}
            subtitle="Anticipating Obstacles"
          />
          <Post
            authorName="Alex Russo"
            authorImage="/src/assets/shared/fahad.png"
            content="Prioritize your mental health! Join our self-care workshop and learn essential tools for self-compassion, boundary-setting, and emotional regulation"
            timeAgo="7d ago"
            likes={70}
            comments={30}
            subtitle="Anticipating Obstacles"
            image="/src/assets/shared/fahad.png"  // Optional
          />
        </div>
      </div>
    </div>
  );
};

export default Psync;
