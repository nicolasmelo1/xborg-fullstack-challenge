import { SafeUser } from "@xborg/shared/all";
import { Expose } from "class-transformer";

export class GetProfileResponseDto implements SafeUser {
  @Expose()
  externalId!: string;

  @Expose()
  email!: string;

  @Expose()
  firstName!: string | null;

  @Expose()
  lastName!: string | null;

  @Expose()
  picture!: string | null;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt!: Date;
}
