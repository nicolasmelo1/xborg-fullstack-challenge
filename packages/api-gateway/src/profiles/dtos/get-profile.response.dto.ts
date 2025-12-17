import { SafeUser } from "@xborg/shared/all";
import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class GetProfileResponseDto implements SafeUser {
  @ApiProperty({ example: "4869b87c-769e-4f74-ac96-0fb9aa6bc14f" })
  @Expose()
  externalId!: string;

  @ApiProperty({ example: "user@example.com" })
  @Expose()
  email!: string;

  @ApiProperty({ nullable: true, example: "Nicolas" })
  @Expose()
  firstName!: string | null;

  @ApiProperty({ nullable: true, example: "Melo" })
  @Expose()
  lastName!: string | null;

  @ApiProperty({ nullable: true, example: "https://example.com/avatar.png" })
  @Expose()
  picture!: string | null;

  @ApiProperty({ example: "2025-12-17T10:00:00.000Z", format: "date-time" })
  @Expose()
  createdAt!: Date;

  @ApiProperty({ example: "2025-12-17T10:05:00.000Z", format: "date-time" })
  @Expose()
  updatedAt!: Date;
}
