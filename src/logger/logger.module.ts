import { Module } from '@nestjs/common';
import { CustomLogger } from './LoggerService';

@Module({
  providers: [CustomLogger],
  exports: [CustomLogger],
})
export class LoggerModule {}
