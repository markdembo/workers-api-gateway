type URL = string;
export type CONTINENT = "NA" | "EU";

export type RegionalRoute = {
  type: "regional";
  regionalEndpoint: Record<CONTINENT, URL> & {
    default: URL;
  };
};

export type GlobalRoute = {
  type: "global";
  endpoint: URL;
};

export type Route = (GlobalRoute | RegionalRoute) & {
  externalPath: string;
  extraHeaders?: Headers;
  removeHeaderKeys?: Array<string>;
  urlTransformer?: (url: URL) => URL;
};
