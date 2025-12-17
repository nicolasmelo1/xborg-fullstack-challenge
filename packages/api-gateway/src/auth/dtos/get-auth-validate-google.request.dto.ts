import { GoogleCode } from "@xborg/shared/all";
import { Expose } from "class-transformer";
import { IsString } from "class-validator";

export class GetAuthValidateGoogleRequestDto implements GoogleCode {
  @IsString()
  @Expose()
  code!: string;
}
