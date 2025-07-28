import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dbmzjqukp',
  api_key: process.env.CLOUDINARY_API_KEY || '622194379619647',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'Gp0TVTbci1g1XcSSWLDCafr2cTQ'
});

// Log only non-sensitive information

export default cloudinary; 