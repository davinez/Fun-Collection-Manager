export type TLoginPayload = {
  email: string;
  password: string;
}

export type TLoginResponse = {
  userId: number;
  userName: string;
  token: string;
  refreshtoken: string;
}

