import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class CreateUserDto {
  @IsEmail({}, { message: "Invalid email format" })
  email: string;

  @IsString()
  @MinLength(6, { message: "Password must be at least 6 character long" })
  password: string;

  @IsString()
  @IsOptional()
  role?: string;
}
