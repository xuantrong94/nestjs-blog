import { Injectable, NotFoundException } from "@nestjs/common";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Post as PostEntity } from "./entities/post.entity";
import { Repository } from "typeorm";

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postsRepository: Repository<PostEntity>
  ) {}

  async findAll(): Promise<PostEntity[]> {
    return this.postsRepository.find();
  }

  async findOne(id: number): Promise<PostEntity> {
    const post = await this.postsRepository.findOne({ where: { id } });
    if (!post) throw new NotFoundException("Post not found");
    return post;
  }

  async create(data: CreatePostDto): Promise<PostEntity> {
    const newPost = this.postsRepository.create(data);
    return this.postsRepository.save(newPost);
  }

  async update(id: number, data: UpdatePostDto): Promise<PostEntity> {
    const post = await this.findOne(id);
    Object.assign(post, data);
    return this.postsRepository.save(post);
  }
  async delete(id: number): Promise<PostEntity> {
    const post = await this.findOne(id);
    return this.postsRepository.remove(post);
  }
}
