import { PathError } from "./errors";

export const getRoute = (pathName: string): string => {
	switch (pathName) {
		case "/weather":
			return "https://api.open-meteo.com/v1/forecast";
		case "/random-fact":
			return "https://uselessfacts.jsph.pl/random.json";
		default:
			throw new PathError("Path does not exist.");
	}

	// TODO: Use KV
	// TODO: Use versioning
};
