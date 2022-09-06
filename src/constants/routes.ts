import { Route } from "types";

const WEATHER_ROUTE: Route = {
  type: "global",
  endpoint: "https://api.open-meteo.com/v1/forecast",
  externalPath: "/weather",
  urlTransformer: (url) => url.replace("%2C", ","),
};

const RANDOM_FACT_ROUTE: Route = {
  type: "global",
  endpoint: "https://uselessfacts.jsph.pl/random.json",
  externalPath: "/random-fact",
};

const HTTP_BIN: Route = {
  type: "regional",
  regionalEndpoint: {
    NA: "http://us01.cloudinstance.info/api/",
    EU: "http://emea01.cloudinstance.info/api/",
    default: "http://emea01.cloudinstance.info/api/",
  },
  externalPath: "/json-server",
};

export const ROUTES = [WEATHER_ROUTE, RANDOM_FACT_ROUTE, HTTP_BIN];
