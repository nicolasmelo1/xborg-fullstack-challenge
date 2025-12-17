import { GoogleStartAuthorization } from "@xborg/shared/all";
import { Expose } from "class-transformer";
import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class GetAuthLoginGoogleRequestDto implements GoogleStartAuthorization {
  @ApiProperty({
    description:
      "Where the backend should redirect after Google validates the login (usually the web popup callback URL).",
    example: "http://localhost:3000/signin/callback",
  })
  @IsString()
  @Expose()
  redirectUrl!: string;
}
