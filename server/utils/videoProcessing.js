import ffmpeg from 'fluent-ffmpeg';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

export const generateThumbnail = async (videoFile) => {
  const thumbnailPath = join(tmpdir(), `${Date.now()}_thumbnail.jpg`);
  
  return new Promise((resolve, reject) => {
    ffmpeg(videoFile.tempFilePath)
      .screenshots({
        timestamps: ['00:00:01'],
        filename: thumbnailPath,
        size: '320x240'
      })
      .on('end', () => resolve(thumbnailPath))
      .on('error', (err) => reject(err));
  });
};

export const getVideoDuration = async (videoFile) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoFile.tempFilePath, (err, metadata) => {
      if (err) reject(err);
      resolve(metadata.format.duration);
    });
  });
}; 