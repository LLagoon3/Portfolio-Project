import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadsStorageService } from './uploads-storage.service';

@Module({
  controllers: [UploadsController],
  providers: [UploadsStorageService],
  exports: [UploadsStorageService],
})
export class UploadsModule {}
