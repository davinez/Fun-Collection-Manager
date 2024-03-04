import * as z from "zod";

// Components Types //



// API/Service Types //

export type TLoginResponse = {
  userName: string;
  userEmail: string;
  token: string;
  refreshtoken: string;
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
