export interface Post {
  id: number;
  image?: string;
  imageUrl?: string;
  title: string;
  author: string;
  date?: string,
  createdAt?: Date;
  content: string;
  likes: number;
  comments?: number;
  collectCount?: number;
}

export interface PostCardProps {
  post: Post;
  isHorizontal: boolean;
}


