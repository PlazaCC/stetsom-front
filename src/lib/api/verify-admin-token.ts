import { jwtVerify } from "jose";
import { isMockMode } from "./route-utils";

function getJwtSecret(): Uint8Array | null {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

/**
 * Verify an admin JWT. In mock mode we accept a simple 3-part token shape.
 * In non-mock mode we validate using `jose` and the `JWT_ACCESS_SECRET`.
 */
export async function verifyAdminToken(token: string): Promise<boolean> {
  if (isMockMode()) {
    const parts = token.split(".");
    return (
      parts.length === 3 &&
      parts[0].length > 0 &&
      parts[1].length > 0 &&
      parts[2] === "mock-signature"
    );
  }

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
