import { getWinstonLogger } from 'src/logger/winston-config';
import { Request, Response, NextFunction } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
  // CREATE LOGGER

  const logger = getWinstonLogger();
  logger.log(
    'info',
    `[REQUEST] method: ${req.method}, url:  ${req.url}; [RESPONSE] Status: ${res.statusCode}, Message: ${res.statusMessage}`,
  );
  next();
}
