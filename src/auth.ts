import { AuthError } from "./errors";

export const PRESHARED_AUTH_HEADER_KEY = 'X-Custom-PSK';
const PRESHARED_AUTH_HEADER_VALUE = 'mypresharedkey';
export const checkAuth = (headers: Headers): void => {
	const psk = headers.get(PRESHARED_AUTH_HEADER_KEY);
	if (psk !== PRESHARED_AUTH_HEADER_VALUE) {
		throw new AuthError("Invalid key provided.");
	}
};
