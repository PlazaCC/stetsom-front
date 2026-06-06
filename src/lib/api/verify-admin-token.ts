import { jwtVerify } from "jose";

function getJwtSecret(): Uint8Array | null {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  const secret = getJwtSecret();
  if (!secret) {
    console.error(
      "[verifyAdminToken] JWT_ACCESS_SECRET não está configurado — rejeitando tokens de admin.",
    );
    return false;
  }

  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}
