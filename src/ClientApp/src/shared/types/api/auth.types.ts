import { z } from "zod";

// Components Types //

export type AccountIdentifiers = {
  localAccountId: string | undefined;
  homeAccountId: string | undefined;
  username: string | undefined;
}


// API/Service Types //

export type TLoginCIAMResponse = {
  localAccountId: string;
  homeAccountId: string;
  userDisplayName: string,
  userEmail: string;
  userRoles: string[];
  accessToken: string;
}

export type TUserAccount = {
  id: number;
  identityProviderId: string;
  createdDate: Date;
}

// Form Types  //

// Not in use
export const loginFormPayload = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Email required" }),
  password: z
    .string()
    .trim()
    .min(8, { message: "Password is required" }),
});
export type TLoginPayload = z.infer<typeof loginFormPayload>;

// General Payloads //

export const createUserAccountPayload = z.object({
  identityProviderId: z
    .string()
    .trim()
    .min(1, { message: "Invalid identityProviderId" }),
  createSubscription: z
    .object({
      isTrialPeriod: z.boolean(),
      subscribeAfterTrial: z.boolean().optional(),
      validTo: z.date(),
      offerId: z.number().min(1, { message: "Invalid offer id" }).optional(),
      planAcquired: z.number().min(1, { message: "Invalid plan acquired id" })
    })
});
export type TCreateUserAccountPayload = z.infer<typeof createUserAccountPayload>;


// Query Params Types //
