import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ProfileRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async getByExternalId(externalId: string): Promise<UserEntity | null> {
    return await this.repository.findOneBy({
      externalId,
    });
  }
}
