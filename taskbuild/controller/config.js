const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const settingsPath = path.join(__dirname,'imagesettings.json');
const cloudinarySettings = JSON.parse(fs.readFileSync(settingsPath, 'utf8')).cloudinary;
cloudinary.config({
  cloud_name: cloudinarySettings.cloud_name,
  api_key: cloudinarySettings.api_key,
  api_secret: cloudinarySettings.api_secret
});

module.exports = cloudinary;
