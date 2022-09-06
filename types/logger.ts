export type AdditionalProperties = {
  [key: string]: string | number | Object;
};

export type LogEntry = {
  level: LogLevels;
  message: string;
  time: Date;
  properties?: AdditionalProperties;
};

export enum LogLevelEnum {
  debug = 10,
  info = 20,
  warning = 30,
  error = 40,
  critical = 50,
}

export type LogLevels =
  | LogLevelEnum.info
  | LogLevelEnum.debug
  | LogLevelEnum.error
  | LogLevelEnum.critical
  | LogLevelEnum.warning;
