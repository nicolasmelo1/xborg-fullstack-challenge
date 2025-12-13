import { Controller, ValidationPipe } from "@nestjs/common";
import { PostAuthLoginGoogleRequestDto } from "../dtos/post-auth-login-google.request.dto";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { EVENTS } from "@xborg/shared/backend";
import { AuthenticateUseCase } from "../use-cases/authenticate.use-case";

@Controller()
export class PostAuthLoginGoogleController {
  constructor(private readonly authenticateUseCase: AuthenticateUseCase) {}

  @MessagePattern(EVENTS.auth.authenticate)
  async create(
    @Payload(new ValidationPipe({ whitelist: true }))
    body: PostAuthLoginGoogleRequestDto,
  ) {
    return await this.authenticateUseCase.execute(body);
  }
}
