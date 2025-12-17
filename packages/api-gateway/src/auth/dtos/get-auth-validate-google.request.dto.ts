import { GoogleCode } from "@xborg/shared/all";
import { Expose } from "class-transformer";
import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class GetAuthValidateGoogleRequestDto implements GoogleCode {
  @ApiProperty({
    description: "Authorization code returned by Google OAuth.",
    example: "4/0ATX87lN...",
  })
  @IsString()
  @Expose()
  code!: string;
}
