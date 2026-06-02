# Step 2: Services + Dependency Injection

## Mục tiêu
- Hiểu cách IoC container tự động inject dependencies
- Tách business logic từ controller vào service
- So sánh với manual DI trong Express

## Kiến thức mới

### Express.js - Manual DI
```typescript
class UserService {
  constructor(db) {
    this.db = db;
  }
}
// Manual: const service = new UserService(db);
```

### NestJS - Automatic DI
```typescript
@Injectable()
export class UsersService {
  constructor(
    @Inject('DATABASE') private db,
    private userRepository: Repository<User>,
  ) {}
}
```

### Syntax quan trọng

| Syntax | Mô tả |
|--------|-------|
| `@Injectable()` | Đánh dấu class có thể inject bởi IoC container |
| Constructor injection | TypeScript inference tự động inject |
| `@Inject('TOKEN')` | Token-based injection (khi không dùng type) |
| `private` keyword | TypeScript shortcut, vừa khai báo vừa assign trong constructor |

## Task checklist

- [x] Đã làm ở Step 1: Tạo posts.service.ts với mock data
- [x] Đã làm ở Step 1: Controller gọi service
- [ ] Hiểu cách DI hoạt động

## Giải thích flow

```
HTTP Request
     │
     ▼
@Controller('posts')  ◄── nhận request, định nghĩa routes
     │
     ▼
 PostsController.findAll()  ◄── gọi service method
     │
     ▼
  PostsService  ◄── IoC tự động inject (không cần new)
     │
     ▼
Response
```

## IoC Container flow trong NestJS

1. Module import PostsService vào providers
2. Khi request đến, NestJS tạo PostsController
3. NestJS thấy constructor cần PostsService
4. IoC container resolve PostsService và inject vào controller
5. Khi request xong, các instances được reuse cho request tiếp theo

## So sánh

| Express | NestJS |
|---------|--------|
| Manual: `new UserService(db)` | Automatic: constructor injection |
| Hardcoded dependencies | Configurable via Module |
| Tight coupling | Loose coupling qua interface |

## Đặc điểm quan trọng của @Injectable

- Class phải có `@Injectable()` decorator mới được inject
- Chỉ inject được trong class cũng là `@Injectable()` hoặc `@Controller()`
- Singleton by default - same instance cho tất cả requests