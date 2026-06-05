import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User as UserEntity } from "./entities/user.entity";
import { Not, Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>
  ) {}

  private async checkEmailUnique(
    email: string,
    excludeId?: number
  ): Promise<void> {
    const existing = await this.usersRepository.findOne({
      where: { email, ...(excludeId && { id: Not(excludeId) }) },
    });
    if (existing) {
      throw new ConflictException("Email already registered");
    }
  }

  async findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException("User Not Found");
    return user;
  }

  async create(data: CreateUserDto): Promise<UserEntity> {
    await this.checkEmailUnique(data.email);
    const newUser = this.usersRepository.create(data);
    // check unique missing
    return this.usersRepository.save(newUser);
  }

  async update(id: number, data: UpdateUserDto): Promise<UserEntity> {
    const user = await this.findOne(id);
    if (data.email) {
      await this.checkEmailUnique(data.email, id);
    }
    Object.assign(user, data);
    return this.usersRepository.save(user);
  }

  async delete(id: number): Promise<UserEntity> {
    const user = await this.findOne(id);
    return this.usersRepository.remove(user);
  }
}
