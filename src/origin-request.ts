import { RequestError } from "./errors";
import { PRESHARED_AUTH_HEADER_KEY } from "./auth";

const filterHeaders = (headers: Headers): Headers => {
	const filteredHeaders = new Headers();
	headers.forEach((value, key) => {
		if (key !== PRESHARED_AUTH_HEADER_KEY)
			filteredHeaders.append(key, value);
	});
	return filteredHeaders;
};
export const fetchRoute = async (route: string, request: Request, searchParams: URLSearchParams) => {
	const routeWithQueryParams = (route + "?" + searchParams).replace("%2C", ",");
	try {
		return await fetch(routeWithQueryParams, { headers: filterHeaders(request.headers) });
	} catch (error) {
		throw new RequestError("Request to origin failed");
	}
};
