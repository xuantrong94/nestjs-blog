# Step 8: Exception Filters + Error Handling

## Mục tiêu
- Xử lý lỗi nhất quán, không crash app
- Tạo custom exception filter
- Sử dụng built-in exceptions

## Kiến thức mới

### Express.js error handling
```typescript
// Cần express-async-errors hoặc try/catch cho async
app.get('/posts', async (req, res, next) => {
  try {
    throw new Error('Not found');
  } catch (e) {
    next(e);
  }
});

// Error handler middleware
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});
```

### NestJS Exception Filters
```typescript
@Injectable()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : 500;
    const message = exception instanceof HttpException
      ? exception.getResponse()
      : 'Internal server error';

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
```

## Built-in Exceptions

| Exception | HTTP Status | Use case |
|-----------|-------------|----------|
| BadRequestException | 400 | Invalid input |
| UnauthorizedException | 401 | Not authenticated |
| ForbiddenException | 403 | Not authorized |
| NotFoundException | 404 | Resource not found |
| ConflictException | 409 | Duplicate resource |
| InternalServerErrorException | 500 | Unexpected errors |

## Custom Exception Filter

### src/common/filters/http-exception.filter.ts
```typescript
@Injectable()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = 500;
    let message: string | object = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || exceptionResponse;
    }

    // Log error (optional)
    if (status >= 500) {
      console.error(exception);
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
```

### Register globally

```typescript
// src/main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
```

## Validation error format

Khi dùng ValidationPipe với class-validator, errors trả về dạng:

```json
{
  "statusCode": 400,
  "message": ["email must be an email", "password must be longer than 6 characters"],
  "error": "Bad Request"
}
```

## Task checklist

- [ ] Tạo `src/common/filters/http-exception.filter.ts`
- [ ] Register global filter in main.ts
- [ ] Test error cases với Postman

## So sánh

| Express | NestJS |
|---------|--------|
| Manual try/catch for async | Auto-catch all exceptions |
| express-async-errors needed | Built-in async handling |
| Error handler middleware | Exception filters |
| `next(error)` to trigger error handler | `throw new NotFoundException()` |
| Scattered error handling | Global exception filter |

## Best practices

1. **Always throw built-in exceptions** - don't create custom error objects
2. **Use global filter** - consistent error format across all endpoints
3. **Don't expose internal errors** - hide implementation details in production
4. **Log 5xx errors** - for debugging and monitoring

## Testing error responses

```bash
# Test 404
curl http://localhost:3000/posts/9999

# Test validation
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{"title": "a"}'  # title too short

# Test unauthorized
curl http://localhost:3000/posts
```

Expected responses:
- 404: `{"statusCode": 404, "message": "Post not found", ...}`
- 400: `{"statusCode": 400, "message": ["title must be longer than 3 characters"], ...}`
- 401: `{"statusCode": 401, "message": "Unauthorized", ...}`