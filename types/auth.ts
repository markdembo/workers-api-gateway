type UUID = string;

export type KeyObject = {
  id: UUID;
  consumerName: UUID;
  allowedExternalPaths: Array<String>;
};
