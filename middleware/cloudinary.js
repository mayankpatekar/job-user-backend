const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Multer setup
const upload = multer({ dest: 'uploads/' ,limits: { fileSize: 10 * 1024 * 1024 }}); // Destination folder for temporary file storage

module.exports = { cloudinary, upload };
