# Step 7: Authorization - Roles-based Access Control

## Mục tiêu
- Phân quyền theo roles (admin vs user)
- Tạo custom @Roles() decorator
- Implement RolesGuard

## Kiến thức mới

Express không có built-in support cho roles-based authorization. Phải viết middleware riêng cho từng role.

NestJS cung cấp Reflection API cho phép tạo custom decorators dễ dàng.

## Files to create

### src/common/decorators/roles.decorator.ts
```typescript
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
```

### src/common/guards/roles.guard.ts
```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role === role);
  }
}
```

## Usage

```typescript
@Controller('posts')
@UseGuards(JwtAuthGuard, RolesGuard) // Multiple guards
export class PostsController {
  @Delete(':id')
  @Roles('admin') // Chỉ admin mới được xóa
  delete(@Param('id') id: string) {
    return this.postsService.delete(+id);
  }
}
```

## Owner-only authorization

Không chỉ check role, mà còn check owner của post.

### Update PostsService
```typescript
@Injectable()
export class PostsService {
  async update(id: number, data: UpdatePostDto, userId: number): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { id } });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Check if user is owner or admin
    if (post.authorId !== userId && userId.role !== 'admin') {
      throw new ForbiddenException('You can only update your own posts');
    }

    // Update logic
  }
}
```

## Task checklist

- [ ] Tạo `src/common/decorators/roles.decorator.ts`
- [ ] Tạo `src/common/guards/roles.guard.ts`
- [ ] Apply `@Roles('admin')` cho DELETE /posts
- [ ] Implement owner-only check trong update/delete methods

## Roles definition

| Role | Permissions |
|------|-------------|
| `user` | Đọc posts, tạo post, sửa post của mình |
| `admin` | Tất cả quyền của user + xóa bất kỳ post nào |

## Combine Guards

```typescript
// Multiple guards = all must pass
@UseGuards(JwtAuthGuard, RolesGuard)

// Use @Public() to skip JwtAuthGuard
@Public()
@Post('login')
login() {}
```

## Error responses

| Error | HTTP Status | When |
|-------|-------------|------|
| UnauthorizedException | 401 | No token / Invalid token |
| ForbiddenException | 403 | Not allowed to access resource |

## So sánh

| Express | NestJS |
|---------|--------|
| Middleware check `req.user.role` | Guard check `context.switchToHttp().getRequest().user.role` |
| Manual role comparison | `@Roles()` decorator + `RolesGuard` |
| Scattered logic | Centralized in guards |