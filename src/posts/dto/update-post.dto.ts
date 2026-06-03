import { IsOptional, IsString, MinLength } from "class-validator";

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;
}
