# Step 1: Setup + Controllers

## Mục tiêu
- Hiểu cách NestJS định nghĩa routes bằng decorators
- Tạo posts controller với mock data
- So sánh với Express.js routing

## Kiến thức mới

### Express.js routing
```typescript
app.get('/posts', (req, res) => {
  res.json(posts);
});
```

### NestJS Controllers
```typescript
@Controller('posts')
export class PostsController {
  @Get()
  findAll(): string {
    return 'posts';
  }
}
```

### NestJS Decorators

| Decorator | Mô tả | Tương đương Express |
|-----------|-------|---------------------|
| `@Controller('prefix')` | Định nghĩa route prefix | `app.use('/posts', router)` |
| `@Get('/path')` | GET method | `app.get()` |
| `@Post()` | POST method | `app.post()` |
| `@Put()` | PUT method | `app.put()` |
| `@Delete()` | DELETE method | `app.delete()` |
| `@Body()` | Lấy body data | `req.body` |
| `@Query()` | Lấy query params | `req.query` |
| `@Param()` | Lấy URL params | `req.params` |

## Task checklist

- [ ] Install dependencies (typeorm, pg, class-validator, class-transformer, `bcrypt, jsonwebtoken)
- [ ] Tạo `src/posts/posts.controller.ts` với CRUD endpoints
- [ ] Tạo `src/posts/posts.service.ts` với mock data array
- [ ] Tạo `src/posts/posts.module.ts`
- [ ] Update `src/app.module.ts` import PostsModule

## Files cần tạo

### src/posts/posts.controller.ts
```typescript
@Controller('posts')
export class PostsController {
  @Get()
  findAll() {
    return 'List of posts';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `Post ${id}`;
  }

  @Post()
  create(@Body() body: any) {
    return 'Create post';
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return `Update post ${id}`;
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return `Delete post ${id}`;
  }
}
```

### src/posts/posts.service.ts
```typescript
@Injectable()
export class PostsService {
  private posts = [
    { id: 1, title: 'Post 1', content: 'Content 1' },
    { id: 2, title: 'Post 2', content: 'Content 2' },
  ];

  findAll() {
    return this.posts;
  }

  findOne(id: number) {
    return this.posts.find((p) => p.id === id);
  }

  create(data: any) {
    const newPost = { id: Date.now(), ...data };
    this.posts.push(newPost);
    return newPost;
  }

  update(id: number, data: any) {
    const index = this.posts.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.posts[index] = { ...this.posts[index], ...data };
      return this.posts[index];
    }
    return null;
  }

  delete(id: number) {
    const index = this.posts.findIndex((p) => p.id === id);
    if (index !== -1) {
      return this.posts.splice(index, 1)[0];
    }
    return null;
  }
}
```

### src/posts/posts.module.ts
```typescript
@Module({
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
```

## Verification

Sau khi hoàn thành, chạy:
```bash
pnpm start:dev
```

Test các endpoints:
- `GET /posts` - trả về danh sách posts
- `GET /posts/1` - trả về post có id 1
- `POST /posts` - tạo post mới
- `PUT /posts/1` - cập nhật post 1
- `DELETE /posts/1` - xóa post 1

## So sánh với Express

| Express | NestJS |
|---------|--------|
| `app.get('/posts', handler)` | `@Controller('posts')` + `@Get()` |
| Handler nhận `(req, res, next)` | Method nhận `@Body(), @Query(), @Param()` |
| Business logic trong handler | Business logic trong Service |
| Router module tách riêng | Controller + Service trong Module |