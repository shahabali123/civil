const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage} = require('multer-storage-cloudinary')

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
    secure: true
});

const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder: 'Civil_2_DEV',
        allowedFormats: ['png', 'jpeg', 'jpg']
    }
});

module.exports = { storage, cloudinary }; // Export the configured cloudinary instance
