import { AuthError, PathError, PermissionError, RequestError } from "./errors";
import { checkAuthentication, checkAuthorization } from "./auth";
import { getRoute } from "./router";
import { fetchOrigin } from "./origin-request";
import { track_api_call } from "./analytics";
import { Logger, NewRelicProvider } from "./logger";
import {
  HTTP_401_NO_OR_INVALID_KEY,
  HTTP_403_PATH_FORBITTEN,
  HTTP_404_INVALID_PATH,
  HTTP_500_GENERAL,
  REQUEST_ENDED_MESSAGE,
} from "./constants/strings";

export interface Env {
  MIXPANEL_PROJECT_TOKEN: string;
  NEW_RELIC_LICENSE_KEY: string;
  API_KEYS: KVNamespace;
}

const mainRequestExecution = async (
  request: Request,
  env: Env,
  logger: Logger
): Promise<Response> => {
  let statusCode: number = -1;
  try {
    const originalUrl = new URL(request.url);
    const key = await checkAuthentication(request.headers, env.API_KEYS);
    const route = getRoute(originalUrl.pathname);
    checkAuthorization(key, route);
    const response = await fetchOrigin(route, request);
    statusCode = response.status;
    return new Response(await response.text(), {
      status: statusCode,
      statusText: response.statusText,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      logger.info(error.message);
      statusCode = 401;
      return new Response(HTTP_401_NO_OR_INVALID_KEY, {
        status: statusCode,
      });
    } else if (error instanceof PermissionError) {
      logger.info("Client requested forbidden path");
      statusCode = 403;
      return new Response(HTTP_403_PATH_FORBITTEN, {
        status: statusCode,
      });
    } else if (error instanceof PathError) {
      logger.info("Client requested invalid path");
      statusCode = 404;
      return new Response(HTTP_404_INVALID_PATH, {
        status: statusCode,
      });
    } else if (error instanceof RequestError) {
      if (error instanceof Error) logger.error(error.message);
      else logger.error(String(error));
      statusCode = 500;
      return new Response(HTTP_500_GENERAL, {
        status: statusCode,
      });
    } else {
      throw error;
    }
  } finally {
    logger.debug(REQUEST_ENDED_MESSAGE, { statusCode });
  }
};

const postRequestExecution = (
  request: Request,
  env: Env,
  ctx: ExecutionContext,
  logger: Logger
) => {
  const originalUrl = new URL(request.url);
  ctx.waitUntil(
    Promise.all([
      logger.flush(),
      track_api_call(
        "00_test",
        originalUrl.pathname,
        env.MIXPANEL_PROJECT_TOKEN
      ),
    ])
  );
};

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const logProvider = new NewRelicProvider(env.NEW_RELIC_LICENSE_KEY);
    const logger = new Logger(logProvider, { ...request });
    const response = mainRequestExecution(request, env, logger);
    postRequestExecution(request, env, ctx, logger);
    return response;
  },
};
