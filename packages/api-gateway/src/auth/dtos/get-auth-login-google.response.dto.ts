import { ApiProperty } from "@nestjs/swagger";

export class GetAUthLoginGoogleResponseDto {
  @ApiProperty({
    example: "https://accounts.google.com/o/oauth2/v2/auth?...",
    description: "Redirect target URL for google oauth2 authentication",
  })
  url!: string;
}
