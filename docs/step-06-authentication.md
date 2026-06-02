# Step 6: Authentication - Manual JWT

## Mục tiêu
- Hiểu cách JWT sign/verify hoạt động
- Implement login/register với bcrypt password hashing
- Tạo JWT authentication guard
- Không dùng Passport để hiểu rõ cách JWT hoạt động

## Auth flow

```
1. POST /auth/register
   → Hash password with bcrypt
   → Create user in database
   → Return success

2. POST /auth/login
   → Find user by email
   → Compare password with bcrypt
   → Generate JWT access token
   → Generate JWT refresh token (optional)
   → Return tokens

3. Protected routes
   → Extract token from Authorization header
   → Verify token with JWT secret
   → Attach user payload to request
   → Allow or deny access
```

## Files to create

### src/auth/jwt.service.ts
```typescript
@Injectable()
export class JwtService {
  constructor(private configService: ConfigService) {}

  sign(payload: { sub: number; email: string; role: string }): string {
    return jwt.sign(payload, this.configService.get('JWT_SECRET'), {
      expiresIn: '15m', // access token expires in 15 minutes
    });
  }

  verify(token: string): { sub: number; email: string; role: string } {
    return jwt.verify(token, this.configService.get('JWT_SECRET')) as any;
  }
}
```

### src/auth/auth.service.ts
```typescript
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.usersService.create({
      email: registerDto.email,
      password: hashedPassword,
      role: 'user',
    });

    return { message: 'User created successfully' };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, '7d'), // optional
    };
  }
}
```

### src/auth/auth.controller.ts
```typescript
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
```

### src/auth/auth.guard.ts
```typescript
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = this.jwtService.verify(token);
      request['user'] = payload;
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
```

### src/auth/dto/login.dto.ts
```typescript
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
```

### src/auth/dto/register.dto.ts
```typescript
export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
```

### src/auth/decorators/public.decorator.ts
```typescript
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

### src/auth/decorators/public.guard.ts (update JwtAuthGuard)
```typescript
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    // ... JWT verification logic
  }
}
```

## Task checklist

- [ ] Tạo `src/auth/auth.module.ts`
- [ ] Tạo `src/auth/jwt.service.ts`
- [ ] Tạo `src/auth/auth.service.ts`
- [ ] Tạo `src/auth/auth.controller.ts`
- [ ] Tạo `src/auth/auth.guard.ts`
- [ ] Tạo `@Public()` decorator
- [ ] Tạo DTOs (login, register)
- [ ] Protect posts endpoints
- [ ] Setup ConfigService cho JWT_SECRET

## Usage

```typescript
@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
  @Post()
  create(@Body() createPostDto: CreatePostDto, @Request() req) {
    // req.user = { sub: number, email: string, role: string }
    return this.postsService.create(createPostDto, req.user.sub);
  }
}
```

## So sánh

| Express middleware | NestJS Guard |
|--------------------|--------------|
| `function auth(req, res, next)` | `@Injectable() implements CanActivate` |
| Manual token extraction | Built-in token extraction |
| `next()` to continue | `return true` to allow |
| res.status(401).send() | `throw new UnauthorizedException()` |

## Security notes

- Passwords phải hash với bcrypt (never store plain text)
- JWT secret phải strong và stored in environment variables
- Access token nên có short expiration (15 minutes)
- Refresh token có thể dùng để get new access token (optional)

## Environment variables

```bash
# .env
JWT_SECRET=your-super-secret-key-at-least-32-characters
JWT_EXPIRATION=15m
```