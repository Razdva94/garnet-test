export interface IJwtPayload {
  userId: number;
  email: string;
  iat: number;
  exp: number;
}
