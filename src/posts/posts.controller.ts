import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  ValidationPipe,
} from "@nestjs/common";
import { Post as PostEntity } from "./entities/post.entity";
import { PostsService } from "./posts.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";

@Controller("posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  @Get()
  findAll(): Promise<PostEntity[]> {
    return this.postsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string): Promise<PostEntity> {
    return this.postsService.findOne(+id);
  }

  @Post()
  create(
    @Body(ValidationPipe) createPostDto: CreatePostDto
  ): Promise<PostEntity> {
    return this.postsService.create(createPostDto);
  }

  @Put(":id")
  update(
    @Param("id") id: string,
    @Body(ValidationPipe) updatePostDto: UpdatePostDto
  ): Promise<PostEntity> {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(":id")
  delete(@Param("id") id: string): Promise<PostEntity> {
    return this.postsService.delete(+id);
  }
}
