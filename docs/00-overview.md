# NestJS Learning Roadmap

## Mục tiêu
Xây blog cơ bản với auth & phân quyền cho developer đã có kinh nghiệm Express.js + TypeScript.

## Tech Stack
- **Runtime:** Node.js
- **Framework:** NestJS
- **Database:** PostgreSQL với TypeORM
- **Auth:** Manual JWT (tự viết để hiểu cách JWT hoạt động)
- **Validation:** class-validator + class-transformer
- **Testing:** Postman (không có frontend)

---

## So sánh kiến trúc Express vs NestJS

| Khái niệm | Express.js | NestJS |
|-----------|------------|--------|
| App instance | `const app = express()` | `new NestApplication()` |
| Entry point | `app.listen(3000)` | `await app.listen(3000)` |
| Middleware | `app.use(middleware)` | Modules + Middleware (built-in) |
| Route handler | `app.get('/path', handler)` | Controller + Route decorators |
| Business logic | Handler function | Service class |
| Request/Response | `req, res` objects | Decorators `@Body, @Query, @Param` |
| DI container | Manual | Built-in IoC container |
| Tổ chức code | Router files | Modules |

### Điểm mới quan trọng của NestJS

- **IoC (Inversion of Control)** - Dependency Injection tự động, không cần inject thủ công
- **Modules** - Tổ chức code theo domain feature
- **Decorators** - Dùng TypeScript decorators thay vì route config
- **Guard/Pipe/Interceptor** - Cross-cutting concerns dạng middleware có cấu trúc

---

## Cấu trúc project mục tiêu

```
src/
├── main.ts                       # Bootstrap (entry point)
├── app.module.ts                 # Root module
├── auth/                         # Authentication module
│   ├── auth.module.ts
│   ├── auth.controller.ts       # POST /auth/login, POST /auth/register
│   ├── auth.service.ts           # verifyUser(), generateToken(), validateToken()
│   ├── auth.guard.ts            # JWT validation guard
│   ├── jwt.service.ts           # sign(), verify()
│   └── dto/
│       ├── login.dto.ts
│       └── register.dto.ts
├── users/                       # Users module
│   ├── users.module.ts
│   ├── users.service.ts
│   └── entities/
│       └── user.entity.ts
├── posts/                       # Posts module
│   ├── posts.module.ts
│   ├── posts.controller.ts
│   ├── posts.service.ts
│   ├── entities/
│   │   └── post.entity.ts
│   └── dto/
│       ├── create-post.dto.ts
│       └── update-post.dto.ts
└── common/                      # Shared utilities
    ├── decorators/
    │   └── roles.decorator.ts
    └── guards/
        └── roles.guard.ts
```

---

## Lộ trình 8 bước

| Step | Nội dung | Mục tiêu |
|------|----------|----------|
| 1 | Setup + Controllers | Hiểu NestJS decorators cho routes |
| 2 | Services + DI | Hiểu IoC container tự động inject |
| 3 | Modules | Tổ chức code theo feature modules |
| 4 | DTOs + Validation | Validate input với class-validator |
| 5 | Database + TypeORM | Kết nối PostgreSQL, Repository pattern |
| 6 | Authentication | Manual JWT (sign/verify, login, register) |
| 7 | Authorization | Roles-based access control (RBAC) |
| 8 | Exception Filters | Xử lý lỗi nhất quán |

---

## API Endpoints cuối cùng

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| POST | /auth/register | Public | Đăng ký user mới |
| POST | /auth/login | Public | Đăng nhập, trả JWT |
| GET | /posts | Authenticated | Danh sách posts |
| GET | /posts/:id | Authenticated | Chi tiết post |
| POST | /posts | Authenticated | Tạo post mới |
| PUT | /posts/:id | Owner only | Cập nhật post |
| DELETE | /posts/:id | Admin only | Xóa post |

---

## User Roles

| Role | Quyền |
|------|-------|
| user | Đọc posts, tạo post, sửa post của mình |
| admin | Tất cả quyền của user + xóa bất kỳ post nào |