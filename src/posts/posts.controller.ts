import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import type { CreatePost, Post as PostType } from "./types";
import { PostsService } from "./posts.service";

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
  create(@Body() body: CreatePost): PostType {
    return this.postsService.create(body);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() body: PostType): PostType {
    return this.postsService.update(+id, body);
  }

  @Delete(":id")
  delete(@Param("id") id: string): PostType {
    return this.postsService.delete(+id);
  }
}
