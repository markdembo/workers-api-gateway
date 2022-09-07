import { KeyObject, Route } from "types";
import { AuthError, PermissionError } from "./errors";

export const PRESHARED_AUTH_HEADER_KEY = "x-api-key";

// From: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#examples
const hash = async (text: string) => {
  const msgUint8 = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};

export const checkAuthentication = async (
  headers: Headers,
  apiKeyKV: KVNamespace
): Promise<KeyObject> => {
  const keyFromHeader = headers.get(PRESHARED_AUTH_HEADER_KEY);
  if (keyFromHeader === null) {
    throw new AuthError("Invalid key provided.");
  }
  const keyFromHeaderHashed = await hash(keyFromHeader);
  if (keyFromHeaderHashed === undefined) {
    throw new Error("Hashing failed.");
  }
  const keyObject = await apiKeyKV.get(keyFromHeaderHashed.trim(), "json");
  if (keyObject === null) {
    throw new AuthError("Invalid key provided.");
  }
  return keyObject as KeyObject;
};

export const checkAuthorization = (key: KeyObject, route: Route) => {
  if (!key.allowedExternalPaths.includes(route.externalPath)) {
    throw new PermissionError();
  }
};
