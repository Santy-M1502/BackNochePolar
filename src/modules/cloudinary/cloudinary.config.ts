import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv';
config();

if (process.env.CLOUDINARY_URL) {
  cloudinary.config(process.env.CLOUDINARY_URL);
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
    api_key: process.env.CLOUDINARY_API_KEY || '',
    api_secret: process.env.CLOUDINARY_API_SECRET || '',
    secure: true,
  });
}

if (!process.env.CLOUDINARY_URL && (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET)) {
  console.warn('[cloudinary] Credenciales incompletas. Asegúrate de configurar CLOUDINARY_URL o CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET.');
}

export { cloudinary };