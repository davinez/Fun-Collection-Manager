import * as z from "zod";

// Components Types //

export type AccountIdentifiers = {
  localAccountId: string | undefined;
	homeAccountId:  string | undefined;
	username:  string | undefined;
}


// API/Service Types //

export type TLoginResponse = {
  localAccountId: string;
	homeAccountId: string;
	username: string;
  userEmail: string;
  userScopes: string[];
  accessToken: string;
}

// Form Types //

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



// Query Params Types //
