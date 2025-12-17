import { Service } from "@xborg/shared/backend";
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import jwt from "jsonwebtoken";
import { User } from "@xborg/shared/all";

@Injectable()
export class SignTokenUseCase implements Service<
  Pick<User, "externalId" | "email">,
  {
    accessToken: string;
    refreshToken: string;
  }
> {
  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService,
  ) {}

  execute(input: Pick<User, "externalId" | "email">): {
    accessToken: string;
    refreshToken: string;
  } {
    const privateKey = this.configService.get<string>("JWT_PRIVATE_KEY")!;
    const expiresIn = this.configService.get<number>("JWT_EXPIRES_IN")!;
    const accessToken = jwt.sign(
      {
        email: input.email,
        externalId: input.externalId,
      },
      privateKey,
      {
        subject: input.externalId,
        expiresIn: Number(expiresIn),
      },
    );
    const refreshToken = jwt.sign(
      {
        email: input.email,
        externalId: input.externalId,
      },
      privateKey,
      {
        subject: input.externalId,
      },
    );
    return {
      accessToken,
      refreshToken,
    };
  }
}
