import { NextFunction, Request, Response } from 'express';
import { HttpCode } from '../../common/enums/http-code';
import { HttpError } from '../../common/errors/http-error';
import { logger } from '../../common/utils/logger.util';

const errorHandlerMiddleware = (
  err: HttpError,
  _: Request,
  res: Response,
  __: NextFunction,
): void => {
  let status = HttpCode.INTERNAL_SERVER_ERROR;
  let message = 'Internal Server Error';

  if (err instanceof HttpError) {
    status = err.status;
    message = err.message;
  }

  logger.error({ status, message });

  res.status(status).send({ error: message });
};

export default errorHandlerMiddleware;
