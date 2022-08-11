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


 const checkAuth = (headers: Headers): boolean => {
	const psk = headers.get(PRESHARED_AUTH_HEADER_KEY);
	if (psk === PRESHARED_AUTH_HEADER_VALUE) {
		return true
	}
	return false
  }


const getRoute = (request: Request): string | undefined => {
	console.log(request.url)
	// TODO: Implement route lookup
	// TODO: Implement versioning transformation
	// TODO: Implement Blue/Green deployment
	return undefined

}

export default {
	async fetch(
		request: Request,
		ctx: ExecutionContext
		): Promise<Response> {

		const auth = checkAuth(request.headers)
		if(!auth) return new Response('Sorry, you have supplied an invalid key.', {
			status: 403,
		  });

		const route = getRoute(request)

		// TODO: Fetch
		// TODO: Add log push to Datadog/Sentry/
		// TODO: Add Mixpanel metric collection
		return new Response("Hello World!");
	},
};
