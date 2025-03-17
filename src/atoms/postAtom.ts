import { atom } from "recoil";

interface PostProps {
    postId: string;
    authorName: string;
    authorImage?: string;
    content: string;
    timeAgo: string;
    likes: number;
    comments: number;
    image?: string;
    title?: string;
    isFavorited?: boolean;
  }

export const postsAtom = atom<PostProps[]>({
  key: "postsAtom",
  default: [],
});
