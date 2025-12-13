import { Service } from "@xborg/shared/backend";

export class UpdateProfileUseCase implements Service<void, void> {
  execute(): void {
    console.log("GetProfileUseCase");
  }
}
