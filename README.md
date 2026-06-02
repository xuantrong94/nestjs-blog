<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Coding Standards & Git Hooks

This project enforces strict coding standards and automated verification using ESLint, Prettier, Husky, and Commitlint.

Dự án áp dụng quy chuẩn code nghiêm ngặt và xác thực tự động thông qua ESLint, Prettier, Husky, và Commitlint.

### 1. Linting & Formatting

You can run static analysis and code formatting manually:
*Bạn có thể tự chạy phân tích tĩnh và định dạng mã nguồn bằng tay:*

```bash
# Run ESLint check & auto-fix
$ pnpm run lint

# Run Prettier format
$ pnpm run format
```

### 2. Git Hooks (Husky & lint-staged)

Git hooks are automated using Husky to ensure only clean code is committed:
*Git hooks được cấu hình tự động qua Husky để đảm bảo chỉ có code sạch mới được commit:*

- **`pre-commit`**: Automatically runs `lint-staged` on your staged files to auto-fix ESLint issues and format your code before committing.
  *Tự động chạy `lint-staged` trên các file đang stage để tự sửa lỗi ESLint và format lại code trước khi ghi nhận.*

### 3. Commit Message Standards (Conventional Commits)

We follow the **Conventional Commits** specification to ensure clean and meaningful git history.
*Chúng ta tuân thủ chuẩn **Conventional Commits** để đảm bảo lịch sử git rõ ràng và dễ theo dõi.*

Commit messages must match the following pattern:
*Tin nhắn commit bắt buộc phải có dạng:*

```text
<type>(<scope>): <description>

# Example:
# feat(posts): add create post controller endpoint
# fix(auth): resolve JWT expiration validation bug
```

#### Allowed Types (Các loại commit được chấp nhận):
- `feat`: A new feature (Tính năng mới)
- `fix`: A bug fix (Sửa lỗi)
- `docs`: Documentation changes (Thay đổi tài liệu)
- `style`: Changes that do not affect the meaning of the code (formatting, missing semicolons, etc.)
- `refactor`: A code change that neither fixes a bug nor adds a feature (Tái cấu trúc code)
- `perf`: A code change that improves performance (Tối ưu hiệu năng)
- `test`: Adding missing tests or correcting existing tests (Viết thêm/sửa test)
- `build`: Changes that affect the build system or external dependencies (Cập nhật dependencies, build tools...)
- `ci`: Changes to our CI configuration files and scripts (Cấu hình CI/CD)
- `chore`: Other changes that don't modify src or test files (Thay đổi linh tinh khác)
- `revert`: Reverts a previous commit (Hoàn tác commit trước đó)

If a commit message does not conform to this specification, the commit will be blocked by `commitlint` automatically.
*Nếu tin nhắn commit không khớp với chuẩn trên, `commitlint` sẽ tự động chặn việc commit.*

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
