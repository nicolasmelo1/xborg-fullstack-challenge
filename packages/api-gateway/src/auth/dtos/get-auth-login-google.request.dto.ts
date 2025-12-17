import { GoogleStartAuthorization } from "@xborg/shared/all";
import { Expose } from "class-transformer";
import { IsString } from "class-validator";

export class GetAuthLoginGoogleRequestDto implements GoogleStartAuthorization {
  @IsString()
  @Expose()
  redirectUrl!: string;
}
