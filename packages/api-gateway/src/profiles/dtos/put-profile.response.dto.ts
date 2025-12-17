import { ApiProperty } from "@nestjs/swagger";

export class PutProfileSuccessResponseDto {
  @ApiProperty({ example: true })
  success!: true;
}

export class PutProfileErrorResponseDto {
  @ApiProperty({ example: false })
  success!: false;

  @ApiProperty({ example: "User not found" })
  error!: string;
}

