export class TokenDTO {
  accessToken: string;
  expiresIn: number;
}

// src/auth/interfaces/jwt-payload.interface.ts
export interface JwtPayload {
  userId: string;
  email: string;
  roles?: string[];
  iat?: number;
  exp?: number;
}
