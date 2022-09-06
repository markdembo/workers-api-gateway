import { Route } from "types";
import { ROUTES } from "./constants/routes";
import { PATH_ERROR_LOG_MESSAGE } from "./constants/strings";
import { PathError } from "./errors";

export const getRoute = (pathName: string): Route => {
	const mappedRoute = ROUTES.find(route => pathName.startsWith(route.externalPath))
	if (!mappedRoute) throw new PathError(PATH_ERROR_LOG_MESSAGE);
	return mappedRoute
};
