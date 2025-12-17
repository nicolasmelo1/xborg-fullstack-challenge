import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ErrorResponseDto {
  @ApiProperty({ example: 401 })
  statusCode!: number;

  @ApiProperty({ example: "Invalid session token" })
  message!: string;

  @ApiPropertyOptional({ example: "Unauthorized" })
  error?: string;
}
