import { Module } from '@nestjs/common';
import { cloudinary } from './cloudinary.config';

@Module({
  providers: [
    {
      provide: 'CLOUDINARY',
      useFactory: () => cloudinary,
    },
  ],
  exports: ['CLOUDINARY'],
})
export class CloudinaryModule {}
