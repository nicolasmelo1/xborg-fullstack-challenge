import { GoogleCode } from "@xborg/shared/all";
import { IsString } from "class-validator";

export class PostAuthLoginGoogleRequestDto implements GoogleCode {
  @IsString()
  code!: string;
}
