import { Post, Body, Controller } from "@nestjs/common";
import { PostAuthLoginGoogleRequestDto } from "../dtos/post-auth-login-google.request.dto";

@Controller("auth/login/google")
export class PostAuthLoginGoogleController {
  constructor() {}

  @Post()
  async create(@Body() body: PostAuthLoginGoogleRequestDto) {
    return body;
  }
}
