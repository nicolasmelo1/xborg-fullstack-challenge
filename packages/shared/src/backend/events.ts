import { User } from "../all/types";

export const EVENTS = {
  user: {
    read: "user.read",
    update: "user.update",
  },
  auth: {
    authenticate: "auth.authenticate",
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
    input: [{ userId: string }];
    output: [{ userId: string }];
  };
};

export type GetEventInput<TEvent extends keyof EventInputAndOutputs> =
  EventInputAndOutputs[TEvent]["input"];

export type GetEventOutput<TEvent extends keyof EventInputAndOutputs> =
  EventInputAndOutputs[TEvent]["output"];
