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
import { UsersService } from "./users.service";
import { User as UserEntity } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  findAll(): Promise<UserEntity[]> {
    return this.usersService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string): Promise<UserEntity> {
    return this.usersService.findOne(+id);
  }

  @Post()
  create(
    @Body(ValidationPipe) createUserDto: CreateUserDto
  ): Promise<UserEntity> {
    return this.usersService.create(createUserDto);
  }

  @Put(":id")
  update(
    @Param("id") id: string,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto
  ): Promise<UserEntity> {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(":id")
  delete(@Param("id") id: string): Promise<UserEntity> {
    return this.usersService.delete(+id);
  }
}
