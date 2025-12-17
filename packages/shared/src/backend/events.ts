import { GoogleCode, UpdateUserInput, User } from "../all/types";

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
    output:
      | {
          success: true;
          user: User;
        }
      | {
          success: false;
          error: string;
        };
  };
  [EVENTS.user.update]: {
    input: UpdateUserInput;
    output:
      | {
          success: true;
        }
      | {
          success: false;
          error: string;
        };
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
