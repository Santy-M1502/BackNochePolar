import { Module } from '@nestjs/common';
import { CloudinaryConfig } from './cloudinary.config';

@Module({
  providers: [
    {
      provide: 'CLOUDINARY',
      useFactory: CloudinaryConfig,
    },
  ],
  exports: ['CLOUDINARY'],
})
export class CloudinaryModule {}
