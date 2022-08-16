import { AuthError, PathError, RequestError } from "./errors";
import { checkAuth } from "./auth";
import { getRoute } from "./router";
import { fetchRoute } from "./origin-request";
import { track_api_call } from "./analytics";

interface Env {
	MIXPANEL_PROJECT_TOKEN: string
  }

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
		): Promise<Response> {
		const originalUrl = new URL(request.url)
		try {
			checkAuth(request.headers)
			const internalRoute = getRoute(originalUrl.pathname)
			const response = await fetchRoute(internalRoute, request, originalUrl.searchParams)
			// TODO: Add log push to Datadog/Sentry/
			ctx.waitUntil(
				track_api_call("00_test", originalUrl.pathname, env.MIXPANEL_PROJECT_TOKEN)
			  )
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
