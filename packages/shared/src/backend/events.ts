import { GoogleCode, User } from "../all/types";

export const EVENTS = {
  user: {
    read: "user.read",
    update: "user.update",
  },
  auth: {
    authenticate: "auth.authenticate",
    refresh: "auth.refresh",
  },
} as const;

export type EventInputAndOutputs = {
  [EVENTS.user.read]: {
    input: User["externalId"];
    output: User | null;
  };
  [EVENTS.user.update]: {
    input: {
      externalId: User["externalId"];
    } & Partial<Omit<User, "id" | "externalId">>;
    output: void;
  };
  [EVENTS.auth.authenticate]: {
    input: GoogleCode;
    output:
      | {
          success: true;
          accessToken: string;
          refreshToken: string;
        }
      | {
          success: false;
          error: string;
        };
  };
  [EVENTS.auth.refresh]: {
    input: User["externalId"];
    output:
      | {
          success: true;
          accessToken: string;
          refreshToken: string;
        }
      | {
          success: false;
          error: string;
        };
  };
};

export type GetEventInput<TEvent extends keyof EventInputAndOutputs> =
  EventInputAndOutputs[TEvent]["input"];

export type GetEventOutput<TEvent extends keyof EventInputAndOutputs> =
  EventInputAndOutputs[TEvent]["output"];
