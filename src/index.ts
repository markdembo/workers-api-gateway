/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

 const PRESHARED_AUTH_HEADER_KEY = 'X-Custom-PSK';
 const PRESHARED_AUTH_HEADER_VALUE = 'mypresharedkey';

 class AuthError extends Error {}
 class PathError extends Error {}
 class RequestError extends Error {}

 const checkAuth = (headers: Headers): void => {
	const psk = headers.get(PRESHARED_AUTH_HEADER_KEY);
	if (psk !== PRESHARED_AUTH_HEADER_VALUE) {
		throw new AuthError("Invalid key provided.")
	}
  }


const getRoute = (pathName: string): string => {
	switch (pathName) {
		case "/weather":
			return "https://api.open-meteo.com/v1/forecast"
		case "/random-fact":
			return "https://uselessfacts.jsph.pl/random.json"
		default:
			throw new PathError("Path does not exist.")
	}

	// TODO: Use KV
	// TODO: Use versioning

}

const filterHeaders = (headers: Headers): Headers =>{
	const filteredHeaders = new Headers()
	headers.forEach((value, key) => {   // Careful, this is very counter-intuitive
		 if(key!== PRESHARED_AUTH_HEADER_KEY) filteredHeaders.append(key,value)
	})
	return filteredHeaders
}

const fetchRoute = async (route: string, request: Request, searchParams: URLSearchParams) =>{
	const routeWithQueryParams = (route + "?" + searchParams).replace("%2C", ",")
	try {
		return await fetch(routeWithQueryParams, {headers: filterHeaders(request.headers)})
	} catch (error) {
		throw new RequestError("Request to origin failed")
	}
}

export default {
	async fetch(
		request: Request,
		ctx: ExecutionContext
		): Promise<Response> {
		const originalUrl = new URL(request.url)

		try {
			checkAuth(request.headers)
			const internalRoute = getRoute(originalUrl.pathname)
			const response = await fetchRoute(internalRoute, request, originalUrl.searchParams)
			// TODO: Add log push to Datadog/Sentry/
			// TODO: Add Mixpanel metric collection
			return  new Response (await response.text(), { status: response.status, statusText: response.statusText})
		} catch (error) {
			if(error instanceof AuthError){
				return new Response('Sorry, you have supplied an invalid key.', {
					status: 403,
				  })
			} else if (error instanceof PathError){
				return new Response('Invalid path', {
					status: 404,
				  });
			} else if (error instanceof RequestError){
				return new Response('Internal server error', {
					status: 500,
				  });
			}
			else{
				throw error
			}
		} 

	},
};
