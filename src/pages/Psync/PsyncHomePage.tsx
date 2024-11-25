import Post from "@/Components/psync/PostComponent"
import PsyncSearchbar from "@/Components/psync/PsyncSearchbar"

const PsyncHomePage = () => {
    return (
        <div className='pt-20 max-w-[80rem] mx-auto'>
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
    )
}

export default PsyncHomePage