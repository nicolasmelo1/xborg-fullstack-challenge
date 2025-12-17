import { ApiProperty } from "@nestjs/swagger";

export class GetAuthValidateGoogleResponseDto {
  @ApiProperty({
    example: "https://frontend-app.com/signin/callback",
    description:
      "Redirect to target URL that was stored in the cookie at the start of the login flow",
  })
  url!: string;
}
