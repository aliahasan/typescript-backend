/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import multer from 'multer';
import config from '../config';
import AppError from '../errors/AppError';

// Configuration
cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

export const sendImageToCloudinary = async (
  imageName: string,
  path: string,
): Promise<string> => {
  if (!imageName || !path) {
    throw new Error('Invalid input: imageName and path are required');
  }
  try {
    const uploadResult = await cloudinary.uploader.upload(path, {
      public_id: imageName,
    });
    await fs.promises.unlink(path).catch((err) => {
      console.error(`Failed to delete file: ${path}`, err);
    });
    return uploadResult.secure_url;
  } catch (error: any) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'failed to upload image');
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });

export const sanitizeFileName = (name: string): string => {
  return name.replace(/[^a-zA-Z0-9-_]/g, '_');
};
