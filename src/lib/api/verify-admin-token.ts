import { jwtVerify } from "jose";
import { isMockMode } from "./route-utils";

function getJwtSecret(): Uint8Array | null {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

/**
 * Verify an admin JWT.
 *
 * Mock mode accepts a simple development-only token shape with a
 * deterministic `mock-signature`. This is strictly for local/dev usage and
 * should never be relied on in staging/production.
 *
 * Non-mock mode validates tokens using `jose` and the configured
 * `JWT_ACCESS_SECRET`.
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
