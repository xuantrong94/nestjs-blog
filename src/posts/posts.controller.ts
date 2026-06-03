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
import type { Post as PostType } from "./types";
import { PostsService } from "./posts.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";

@Controller("posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  @Get()
  findAll(): PostType[] {
    return this.postsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.postsService.findOne(+id);
  }

  @Post()
  create(@Body(ValidationPipe) createPostDto: CreatePostDto): PostType {
    return this.postsService.create(createPostDto);
  }

  @Put(":id")
  update(
    @Param("id") id: string,
    @Body(ValidationPipe) updatePostDto: UpdatePostDto
  ): PostType {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(":id")
  delete(@Param("id") id: string): PostType {
    return this.postsService.delete(+id);
  }
}
