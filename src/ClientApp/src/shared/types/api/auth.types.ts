export type TLoginPayload = {
  email: string;
  password: string;
}

export type TLoginResponse = {
  userName: string;
  userEmail: string;
  token: string;
  refreshtoken: string;
}

