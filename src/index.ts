import { AuthError, PathError, RequestError } from "./errors";
import { getKeyFromAuthHeader } from "./auth";
import { getRoute } from "./router";
import { fetchRoute } from "./origin-request";
import { track_api_call } from "./analytics";
import { Logger, NewRelicProvider } from "./logger";

export interface Env {
  MIXPANEL_PROJECT_TOKEN: string;
  NEW_RELIC_LICENSE_KEY: string;
  API_KEYS: KVNamespace;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const logProvider = new NewRelicProvider(env.NEW_RELIC_LICENSE_KEY)
    const logger = new Logger(logProvider,{...request});
    let statusCode: number = -1;
    try {
      const originalUrl = new URL(request.url);
      logger.debug("Request started", {
        path: originalUrl.pathname,
        headers: request.headers,
      });
      // Authentication
      const key = await getKeyFromAuthHeader(request.headers, env.API_KEYS);
      // Authorization
      const internalRoute = getRoute(originalUrl.pathname);
      const response = await fetchRoute(
        internalRoute,
        request,
        originalUrl.searchParams
      );
      statusCode = response.status;
      ctx.waitUntil(
        track_api_call(
          "00_test",
          originalUrl.pathname,
          env.MIXPANEL_PROJECT_TOKEN
        )
      );
      return new Response(await response.text(), {
        status: statusCode,
        statusText: response.statusText,
      });
    } catch (error) {
      if (error instanceof AuthError) {
        statusCode = 403;
        return new Response("Sorry, you have supplied an invalid key.", {
          status: statusCode,
        });
      } else if (error instanceof PathError) {
        statusCode = 404;
        return new Response("Invalid path", {
          status: statusCode,
        });
      } else if (error instanceof RequestError) {
        statusCode = 500;
        return new Response("Internal server error", {
          status: statusCode,
        });
      } else {
        throw error;
      }
    } finally {
      logger.debug("Resquest finished", { statusCode });


      ctx.waitUntil(logger.flush());
    }
  },
};
