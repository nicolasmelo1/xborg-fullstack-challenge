import { UpdateUserInput } from "@xborg/shared/all";
import { IsEmail, IsOptional, IsString, IsUrl } from "class-validator";

export class PutProfileRequestDto implements Omit<
  UpdateUserInput,
  "externalId"
> {
  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  firstName?: string | null;

  @IsString()
  @IsOptional()
  lastName?: string | null;

  @IsString()
  @IsOptional()
  @IsUrl()
  picture?: string | null;
}
