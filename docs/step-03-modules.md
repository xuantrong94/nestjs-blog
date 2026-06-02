# Step 3: Modules

## Mục tiêu
- Hiểu cách tổ chức code theo feature modules
- So sánh với cách tổ chức router files trong Express

## Kiến thức mới

### Express.js - không có Module
```typescript
// routes/users.js
const express = require('express');
const router = express.Router();
module.exports = router;

// app.js
const usersRouter = require('./routes/users');
app.use('/users', usersRouter);
```

### NestJS - Module system
```typescript
@Module({
  imports: [DatabaseModule],      // Module khác cần dùng
  controllers: [PostsController],  // Routes trong module
  providers: [PostsService],     // Services/Providers
  exports: [PostsService],        // Chia sẽ với module khác
})
export class PostsModule {}
```

### Module decorator properties

| Property | Mô tả |
|----------|-------|
| `imports` | Module khác cần dùng (không bắt buộc) |
| `controllers` | Controllers xử lý routes (không bắt buộc) |
| `providers` | Services/Providers (không bắt buộc) |
| `exports` | Chia sẽ providers với module khác (không bắt buộc) |

## Task checklist

- [x] Đã làm ở Step 1: Tạo posts.module.ts
- [ ] Tạo users.module.ts (empty structure, implement ở step sau)
- [ ] Update app.module.ts import PostsModule

## Files cần tạo

### src/users/users.module.ts
```typescript
@Module({
  controllers: [],
  providers: [],
})
export class UsersModule {}
```

### src/app.module.ts (updated)
```typescript
@Module({
  imports: [PostsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

## Cấu trúc feature module

```
src/
├── app.module.ts              # Root module - import all features
├── posts/
│   ├── posts.module.ts       # Posts feature module
│   ├── posts.controller.ts
│   └── posts.service.ts
└── users/
    ├── users.module.ts        # Users feature module
    └── users.service.ts
```

## So sánh

| Express | NestJS |
|---------|--------|
| Router files | Feature modules |
| `app.use('/posts', postsRouter)` | `@Module({ controllers: [PostsController] })` |
| Phải import từng router | Import entire module |
| Loose organization | Strict structure (controller/service/entity) |

## Quy tắc Module

1. Mỗi feature = một folder với `{feature}.module.ts`
2. Module là nơi định nghĩa what belongs together
3. Root module (app.module) import tất cả feature modules
4. Providers phải được export để modules khác dùng