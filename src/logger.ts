import { AdditionalProperties, LogEntry, LogLevelEnum, LogLevels } from "types";

export class Logger {
  logs: LogEntry[];
  commonAttributes: {};
  logProvider: LogProvider;
  logLevel: LogLevels;

  constructor(
    logProvider: LogProvider,
    commonAttributes?: Object,
    logLevel?: LogLevels | undefined
  ) {
    this.logs = [];
    this.commonAttributes = { ...commonAttributes };
    this.logProvider = logProvider;
    this.logLevel = logLevel ? logLevel : 30;
  }

  private log(
    level: LogLevels,
    message: string,
    properties?: AdditionalProperties
  ) {
    this.logs.push({
      level: level,
      time: new Date(),
      message,
      properties,
    });
  }

  private getLogLevelLogs(): LogEntry[] {
    return this.logs.filter((log) => log.level >= this.logLevel);
  }

  setLogLevel(level: LogLevels) {
    this.logLevel = level;
  }

  debug(message: string, properties?: AdditionalProperties) {
    this.log(LogLevelEnum.debug, message, properties);
  }

  info(message: string, properties?: AdditionalProperties) {
    this.log(LogLevelEnum.info, message, properties);
  }

  warning(message: string, properties?: AdditionalProperties) {
    this.log(LogLevelEnum.warning, message, properties);
  }

  error(message: string, properties?: AdditionalProperties) {
    this.log(LogLevelEnum.error, message, properties);
  }

  critical(message: string, properties?: AdditionalProperties) {
    this.log(LogLevelEnum.critical, message, properties);
  }

  async flush() {
    this.logProvider.flush(this.getLogLevelLogs(), this.commonAttributes);
  }
}

abstract class LogProvider {
  name: string;
  constructor(name: string) {
    this.name = name;
  }

  abstract format(log: LogEntry): Object;

  abstract flush(logs: LogEntry[], commonAttributes?: Object): void;
}

export class NewRelicProvider extends LogProvider {
  apiEndpoint: string;
  licenseKey: string;
  constructor(
    licenseKey: string,
    apiEndpoint = "https://log-api.eu.newrelic.com/log/v1"
  ) {
    super("NewRelic");
    this.licenseKey = licenseKey;
    this.apiEndpoint = apiEndpoint;
  }

  format(
    log: LogEntry,
    commonAttributes?: Record<string, any>
  ): Record<string, any> {
    const outputLog = {
      ...log.properties,
      ...commonAttributes,
      timestamp: log.time.getTime(),
      message: log.message,
      level: log.level,
    };
    return outputLog;
  }

  async flush(logs: LogEntry[], commonAttributes?: Record<string, any>) {
    logs.forEach(async (log) => {
      const body = this.format(log, commonAttributes);
      await fetch(this.apiEndpoint, {
        method: "POST",
        headers: {
          "Api-Key": this.licenseKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
    });
  }
}

export class ConsoleLogProvider extends LogProvider {
  constructor() {
    super("Console");
  }

  format(
    log: LogEntry,
    commonAttributes?: Record<string, any>
  ): Record<string, any> {
    const outputLog = {
      ...log.properties,
      ...commonAttributes,
      timestamp: log.time.getTime(),
      message: log.message,
      level: log.level,
    };
    return outputLog;
  }

  async flush(logs: LogEntry[], commonAttributes?: Record<string, any>) {
    logs.forEach((log) => {
      const body = this.format(log, commonAttributes);
      console.log(JSON.stringify(body));
    });
  }
}
