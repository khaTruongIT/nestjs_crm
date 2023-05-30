import { getWinstonLogger } from 'src/logger/winston-config';
import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Logger } from 'winston';
import _ from 'lodash';

/**
 *
 * @param res
 * 1 Perform res.write in object mode. This takes in the Buffer chunks as a rest parameter. Using object mode avoids needing to specify the res.write encoding arg.
 * 2 res.write goes over all chunks and store them in resArgs[]. If any chunk throws an error due to a full buffer as determined by !resArgs[i], drain and resume stream from error chunk.
The first chunk (chunks[0]) is important: It contains a Buffer of res.body. Store this in an array (chunkBuffers[]) outside of res.write.
 * 3 At the very end, pass in resArgs[] as arguments of rawResponse via apply(). This determines the output boolean returned by res.write.
 * 4 With res.write done, end the stream with res.end. Run this too in object mode to skip specifying the encoding.
Same as res.write, go over all chunks and store them in its own resArgs[]. The exception is the first chunk (chunks[0]) which is stored in the same external array (chunkBuffers[])
 * 5 With all chunks[0] processed, concat them and encode as utf8. Parsing with JSON.parse reveals the response object. Include it with responseLog.
 * 6 Lastly, emit the end event by passing resArgs[] as arguments of rawResponse via apply(). This terminates the stream to prevent the service response from being stuck on waiting for the stream to end.  
*/
const getResponseLog = (res: Response) => {
  const rawResponse = res.write;
  const rawResponseEnd = res.end;
  const logger = getWinstonLogger();

  let chunkBuffers = [];

  // New chunk passed in as Buffer each time write() is called by stream
  // Take chunks as a rest parameter since it is an array. This allows applying Array methods directly (ref MDN)
  // res.write below is in object mode for write to avoid needing encoding arg (https://nodejs.org/api/stream.html#writable_writevchunks-callback)

  // console.log(`======>> Beginning res.write`);
  res.write = (...chunks) => {
    // Not able to console.log in res.write: It is a writable stream
    const resArgs = [];
    for (let i = 0; i < chunks.length; i++) {
      // undefined values would break Buffer.concat(resArgs)
      if (chunks[i]) resArgs[i] = Buffer.from(chunks[i]);

      // This handling comes in when buffer is full, hence rawResponse === false after rawResponse.apply() below
      // Ref: Example under https://nodejs.org/api/stream.html#class-streamwritable
      // Callback (res.write) resumes write stream
      if (!chunks[i]) {
        res.once('drain', res.write);

        // Resume from last falsy iteration
        --i;
      }
    }

    // Join together all collected Buffers in 1 array
    if (Buffer.concat(resArgs)?.length) {
      chunkBuffers = [...chunkBuffers, ...resArgs];
    }

    // res.write shuold return true if the internal buffer is less than the default highWaterMark. If false is returned, further attempts to write data to the stream should stop until the 'drain' event is emitted.
    // The apply() method accepts two arguments (Ref: https://www.javascripttutorial.net/javascript-apply-method/):
    // thisArg (res) is the value of 'this' provided for function rawResponse
    // The args argument (restArgs) is an array that specifies the arguments of the function rawResponse
    return rawResponse.apply(res, resArgs);
  };

  // console.log(`========> Done writing, beginning res.end`);
  res.end = (...chunks) => {
    // Will log nothing: res.write is a writable stream
    // console.log(
    //   `========> Chunks gathered during res.write: ${typeof chunkBuffers}`,
    //   Buffer.from(chunkBuffers).toJSON(),
    // );
    // console.log(
    //   `========> Chunks to handle during res.end: ${typeof chunks}`,
    //   Buffer.from(chunks).toJSON(),
    // );

    const resArgs = [];
    for (let i = 0; i < chunks.length; i++) {
      // console.log(`res.end chunk ${i} content: ${typeof chunks[i]}`, chunks[i]);

      // undefined values would break Buffer.concat(resArgs)
      if (chunks[i]) resArgs[i] = Buffer.from(chunks[i]);
    }

    // resArgs[0] contains the response body
    if (Buffer.concat(resArgs)?.length) {
      chunkBuffers = [...chunkBuffers, ...resArgs];
    }

    // Join together all collected Buffers then encode as utf8 string
    const body = Buffer.concat(chunkBuffers).toString('utf8');

    // Set custom header for response
    res.setHeader('origin', 'restjs-req-res-logging-repo');

    const responseLog = {
      statusCode: res.statusCode,
      body: JSON.parse(body) || body || {},
      // Returns a shallow copy of the current outgoing headers
      // headers: res.getHeaders(),
    };

    // console.log('res: ', responseLog);

    // res.end() is satisfied after passing in restArgs as params
    // Doing so creates 'end' event to indicate that the entire body has been received.
    // Otherwise, the stream will continue forever (ref: https://nodejs.org/api/stream.html#event-end_1)
    rawResponseEnd.apply(res, resArgs);
    logger.log('info', `[RESPONSE] ${JSON.stringify(responseLog)}}`);
    return responseLog as unknown as Response;
  };
};

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger: Logger;
  constructor() {
    this.logger = getWinstonLogger();
  }
  use(req: Request, res: Response, next: NextFunction) {
    const { method, url, body, originalUrl } = req;
    const { statusCode, statusMessage } = res;
    // const responseLog = getResponseLog(res) as unknown as Response;
    // console.log(`responseLog in logger : ${responseLog}`);

    this.logger.log(
      'info',
      `[REQUEST] method: ${method}, url:  ${url}, body: ${JSON.stringify(body)}`,
    );

    // GET response log
    getResponseLog(res);

    next();
  }
}
