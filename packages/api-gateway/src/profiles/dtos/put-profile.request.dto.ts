import { UpdateUserInput } from "@xborg/shared/all";
import { IsEmail, IsOptional, IsString, IsUrl } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class PutProfileRequestDto implements Omit<
  UpdateUserInput,
  "externalId"
> {
  @ApiPropertyOptional({ example: "user@example.com" })
  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ nullable: true, example: "Nicolas" })
  @IsString()
  @IsOptional()
  firstName?: string | null;

  @ApiPropertyOptional({ nullable: true, example: "Melo" })
  @IsString()
  @IsOptional()
  lastName?: string | null;

  @ApiPropertyOptional({ nullable: true, example: "https://example.com/me.png" })
  @IsString()
  @IsOptional()
  @IsUrl()
  picture?: string | null;
}
