import { Injectable, NotFoundException } from "@nestjs/common";
import type { CreatePost, Post } from "./types";

@Injectable()
export class PostsService {
  private posts: Post[] = [
    {
      id: 1,
      title: "Post 1",
      content: "Content 1",
    },
    {
      id: 2,
      title: "Post 2",
      content: "Content 2",
    },
  ];

  findAll(): Post[] {
    return this.posts;
  }

  findOne(id: number): Post {
    const post = this.posts.find((p) => p.id === id);
    if (!post) throw new NotFoundException("Post not found");
    return post;
  }

  create(data: CreatePost): Post {
    const newPost = { id: Date.now(), ...data };
    this.posts.push(newPost);
    return newPost;
  }

  update(id: number, data: Post): Post {
    const index = this.posts.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.posts[index] = { ...this.posts[index], ...data };
      return this.posts[index];
    }
    throw new NotFoundException("Post not found");
  }
  delete(id: number): Post {
    const index = this.posts.findIndex((p) => p.id === id);
    if (index !== -1) {
      return this.posts.splice(index, 1)[0];
    }
    throw new NotFoundException("Post not found");
  }
}
