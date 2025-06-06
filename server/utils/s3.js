import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { createReadStream } from 'fs';
import { basename } from 'path';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

export const uploadToS3 = async (file, folder) => {
  const fileName = `${folder}/${Date.now()}_${basename(file.name || file)}`;
  
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: file.tempFilePath ? createReadStream(file.tempFilePath) : createReadStream(file),
    ContentType: file.mimetype || 'application/octet-stream'
  });

  try {
    await s3Client.send(command);
    return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
  } catch (error) {
    console.error('S3 upload error:', error);
    throw error;
  }
};

export const deleteFromS3 = async (fileUrl) => {
  const key = fileUrl.split('.com/')[1];
  
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key
  });

  try {
    await s3Client.send(command);
  } catch (error) {
    console.error('S3 delete error:', error);
    throw error;
  }
}; 