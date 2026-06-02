# Step 4: DTOs + Validation

## Mục tiêu
- Sử dụng class-validator để validate input
- Tạo DTOs cho Create/Update operations

## Kiến thức mới

### Express.js - express-validator
```typescript
app.post('/posts', [
  body('title').notEmpty().isString(),
  body('content').isString(),
], (req, res) => {});
```

### NestJS - class-validator
```typescript
export class CreatePostDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  content: string;
}
```

### Common validators

| Decorator | Mô tả |
|-----------|-------|
| `@IsString()` | Phải là string |
| `@IsEmail()` | Phải là email format |
| `@IsInt()` | Phải là integer |
| `@MinLength(n)` | Độ dài tối thiểu |
| `@MaxLength(n)` | Độ dài tối đa |
| `@IsEnum(Enum)` | Phải là enum value |
| `@IsOptional()` | Có thể undefined |
| `@IsArray()` | Phải là array |

## Task checklist

- [ ] Tạo `src/posts/dto/create-post.dto.ts`
- [ ] Tạo `src/posts/dto/update-post.dto.ts`
- [ ] Enable ValidationPipe in main.ts
- [ ] Apply DTOs vào controller methods

## Files cần tạo

### src/posts/dto/create-post.dto.ts
```typescript
import { IsString, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  content: string;
}
```

### src/posts/dto/update-post.dto.ts
```typescript
import { IsString, IsOptional, MinLength } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;
}
```

### src/main.ts (update)
```typescript
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
```

### src/posts/posts.controller.ts (update)
```typescript
@Post()
create(@Body(ValidationPipe) createPostDto: CreatePostDto) {
  return this.postsService.create(createPostDto);
}

@Put(':id')
update(
  @Param('id') id: string,
  @Body(ValidationPipe) updatePostDto: UpdatePostDto,
) {
  return this.postsService.update(+id, updatePostDto);
}
```

## ValidationPipe options

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,           // Loại bỏ fields không defined in DTO
    forbidNonWhitelisted: true, // Throw error nếu có field lạ
    transform: true,            // Tự động transform types (string -> number)
  }),
);
```

## So sánh

| Express | NestJS |
|---------|--------|
| express-validator | class-validator decorators |
| Validation logic trong middleware | Validation logic trong DTO class |
| Manual error messages | Decorator-based error messages |
| Phải tự handle async errors | Auto-handled by ValidationPipe |

## Error response format

```json
{
  "statusCode": 400,
  "message": ["title must be a string", "title must be longer than 3 characters"],
  "error": "Bad Request"
}
```