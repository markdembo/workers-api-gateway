import { AuthError } from "./errors";

export const PRESHARED_AUTH_HEADER_KEY = 'x-api-key';

type UUID = string

type KeyObject = {
	"id": UUID,
	"consumerName": UUID,
	"allowedRouteIds": UUID[]
  }


// From: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#examples
const  hash = async (text: string) => {
	const msgUint8 = new TextEncoder().encode(text);                
	const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);       
	const hashArray = Array.from(new Uint8Array(hashBuffer));                 
	const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join(''); 
	return hashHex;
  }

export const getKeyFromAuthHeader  = async (headers: Headers, apiKeyKV: KVNamespace): Promise<KeyObject> => {

	const keyFromHeader = headers.get(PRESHARED_AUTH_HEADER_KEY);
	if (keyFromHeader === null)  {
		throw new AuthError("Invalid key provided.");
	}
	const keyFromHeaderHashed = await hash(keyFromHeader)
	console.log(keyFromHeaderHashed)
	if (keyFromHeaderHashed === undefined) {
		throw new Error("Hashing failed.");
	}
	const keyObject = await apiKeyKV.get(keyFromHeaderHashed.trim(), "json")
	if (keyObject === null) {
		throw new AuthError("Invalid key provided.");
	}
	return keyObject as KeyObject
};