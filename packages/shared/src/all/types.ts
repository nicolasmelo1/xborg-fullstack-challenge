export type User = {
  id: number;
  externalId: string;
  googleId: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  picture?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type SafeUser = Omit<User, "id" | "googleId">;

export type GoogleUserInfo = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  pictureUrl: string;
};

export type GoogleCode = {
  code: string;
};
