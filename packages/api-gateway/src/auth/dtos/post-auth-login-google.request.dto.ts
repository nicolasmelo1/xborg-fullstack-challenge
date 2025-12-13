import { GoogleUserInfo } from "@xborg/shared/all/types";
import { IsEmail, IsNumberString, IsString, IsUrl } from "class-validator";

export class PostAuthLoginGoogleRequestDto implements GoogleUserInfo {
  @IsString()
  @IsEmail()
  email!: string;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsString()
  @IsUrl()
  pictureUrl!: string;

  @IsString()
  @IsNumberString()
  id!: string;
}
