import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class UpdateUserDto {
  @IsEmail({}, { message: "Invalid email format" })
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  password?: string;

  @IsString()
  @IsOptional()
  role?: string;
}
