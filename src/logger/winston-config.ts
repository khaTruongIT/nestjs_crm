import {
  createLogger,
  format,
  Logger,
  LoggerOptions,
  transports,
} from 'winston';
import 'winston-daily-rotate-file';

export const uppercasedLogLevel = format((info) => {
  info.level = info.level.toUpperCase();
  return info;
});

export const messageLogFormat = format.printf((info) => {
  // console.log('info', info);
  return `[${info.timestamp}] [${info.level}] - ${info.message}`;
});

export const defaultLogFormat = format.combine(
  uppercasedLogLevel(),
  format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss.SSS',
  }),
);

export const consoleTransport = new transports.Console({
  level: 'info',
  format: format.combine(defaultLogFormat, format.colorize(), messageLogFormat),
});

export const fileTransport = new transports.DailyRotateFile({
  filename: 'app-%DATE%',
  extension: '.log',
  dirname: 'logs',
  datePattern: 'YYYY-MM-DD',
  maxSize: '100m',
  maxFiles: '30d',
  level: 'info',
  format: format.combine(defaultLogFormat, messageLogFormat),
});

export const WINSTON_LOGGER_OPTIONS: LoggerOptions = {
  exitOnError: false,
  transports: [consoleTransport, fileTransport],
};

export const getWinstonLogger = () => {
  const logger: Logger = createLogger(WINSTON_LOGGER_OPTIONS);
  return logger;
};

