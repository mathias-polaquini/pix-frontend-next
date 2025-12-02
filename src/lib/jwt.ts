import jwt from "jsonwebtoken";

export type JWTPayload = {
  sub: number;
  name: string;
  email: string;
  iat: number;
  exp: number;
};



function isJWTPayload(decoded: unknown): decoded is JWTPayload {
  return (
    typeof decoded === "object" &&
    decoded !== null &&
    "sub" in decoded &&
    "email" in decoded &&
    "name" in decoded &&
    "iat" in decoded &&
    "exp" in decoded &&
    typeof (decoded as Record<string, unknown>).sub === "number" &&
    typeof (decoded as Record<string, unknown>).email === "string" &&
    typeof (decoded as Record<string, unknown>).name === "string" &&
    typeof (decoded as Record<string, unknown>).iat === "number" &&
    typeof (decoded as Record<string, unknown>).exp === "number"
  );
}
export function verifyToken(token: string, secret: string): JWTPayload {
  const decoded = jwt.verify(token, secret);

  if (!isJWTPayload(decoded)) {
    throw new Error("Token inválido");
  }
  return decoded;
}




