import { RequestError } from "./errors";
import { PRESHARED_AUTH_HEADER_KEY } from "./auth";

import { ORIGIN_ERROR_LOG_MESSAGE } from "./constants/strings";
import { CONTINENT, Route } from "../types/routes";

const filterHeaders = (headers: Headers): Headers => {
  const filteredHeaders = new Headers();
  headers.forEach((value, key) => {
    if (key !== PRESHARED_AUTH_HEADER_KEY) filteredHeaders.append(key, value);
  });
  return filteredHeaders;
};

export const getInternalRoute = (route: Route, request: Request): string => {
  if (route.type === "global") return route.endpoint;
  else {
    if (
      request.cf?.continent &&
      route.regionalEndpoint[request.cf.continent as CONTINENT]
    ) {
      return route.regionalEndpoint[request.cf!.continent as CONTINENT];
    } else return route.regionalEndpoint.default;
  }
};

export const fetchOrigin = async (route: Route, request: Request) => {
  // Construct new URL based on route
  const internalRoute = getInternalRoute(route, request);
  const originalUrl = new URL(request.url);
  const subPath = originalUrl.pathname.replace(route.externalPath, "");
  const newUrl = new URL(`${internalRoute}${subPath}`);
  newUrl.search = originalUrl.search;
  let urlString = newUrl.toString();

  // Transform request, if specificed in Route object
  if (route.urlTransformer) {
    urlString = route.urlTransformer(urlString);
  }

  // Fetch request
  const modifiedRequest = new Request(request, {
    headers: filterHeaders(request.headers),
  });
  try {
    return await fetch(urlString, modifiedRequest);
  } catch (error) {
    throw new RequestError(ORIGIN_ERROR_LOG_MESSAGE);
  }
};
