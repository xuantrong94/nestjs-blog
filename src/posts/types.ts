export interface Post {
  id: number;
  title: string;
  content: string;
}

export type CreatePost = Omit<Post, "id">;
