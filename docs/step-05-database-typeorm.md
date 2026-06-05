# Step 5: Database + TypeORM

## Mục tiêu
- Kết nối PostgreSQL với TypeORM
- Tạo User và Post entities với relations
- Dùng Repository pattern thay vì mock data

## Kiến thức mới

### Express.js + Knex
```typescript
const users = await knex('users').where({ id });
```

### NestJS + TypeORM
```typescript
const users = await this.userRepository.find({ where: { id } });
```

## Setup

### 1. Cài đặt Docker PostgreSQL
```bash
docker run --name nestjs-blog-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=nestjs-blog -p 5432:5432 -d postgres
```

### 2. Database config
```typescript
// src/app.module.ts
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'nestjs-blog',
      entities: [User, Post],
      synchronize: true, // chỉ dùng trong dev, production dùng migrations
    }),
  ],
  // ...
})
```

## Entity definitions

### User entity
```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // hashed

  @Column({ default: 'user' })
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];
}
```

### Post entity
```typescript
@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column()
  authorId: number;

  @CreateDateColumn()
  createdAt: Date;
}
```

## Repository pattern

### UsersService
```typescript
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(data: Partial<User>): Promise<User> {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }
}
```

## Task checklist

- [x] Setup PostgreSQL (Docker)
- [x] Configure TypeORM in app.module.ts
- [x] Tạo `src/users/entities/user.entity.ts`
- [x] Tạo `src/posts/entities/post.entity.ts`
- [x] Update PostsService dùng Repository
- [x] Update UsersService dùng Repository

## Column types

| Type | Mô tả |
|------|-------|
| `@PrimaryGeneratedColumn()` | Auto-increment primary key |
| `@PrimaryColumn()` | Manual primary key |
| `@Column()` | Regular column |
| `@Column({ unique: true })` | Unique column |
| `@Column({ default: 'value' })` | Column với default value |
| `@CreateDateColumn()` | Auto-set timestamp on create |
| `@UpdateDateColumn()` | Auto-set timestamp on update |
| `@VersionColumn()` | Optimistic locking |

## Relations

| Relation | Mô tả |
|----------|-------|
| `@OneToMany(() => Entity, (e) => e.property)` | 1 user có nhiều posts |
| `@ManyToOne(() => Entity)` | Nhiều posts thuộc 1 user |
| `@ManyToMany(() => Entity)` | N-N relationship |
| `@OneToOne(() => Entity)` | 1-1 relationship |

## So sánh

| Express + Knex | NestJS + TypeORM |
|----------------|------------------|
| `knex('users').select()` | `userRepository.find()` |
| `knex('users').insert()` | `userRepository.create()` + `save()` |
| `knex('users').where('id', id)` | `userRepository.findOne({ where: { id } })` |
| Manual query building | Entity + Repository abstraction |

## Module setup

```typescript
// src/users/users.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

// src/posts/posts.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([Post]), UsersModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
```

**Lưu ý:** PostsModule import UsersModule để dùng UsersService cho relations.