import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { UpdateUserInput } from "@xborg/shared/all";

@Injectable()
export class ProfileRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async getByExternalId(externalId: string): Promise<UserEntity | undefined> {
    return (
      (await this.repository.findOneBy({
        externalId,
      })) ?? undefined
    );
  }

  async getByGoogleId(googleId: string): Promise<UserEntity | undefined> {
    return (
      (await this.repository.findOneBy({
        googleId,
      })) ?? undefined
    );
  }

  async create(user: Omit<UserEntity, "id">): Promise<void> {
    await this.repository.insert(user);
  }

  async update(user: UpdateUserInput): Promise<void> {
    await this.repository.update(
      {
        externalId: user.externalId,
      },
      user,
    );
  }
}
