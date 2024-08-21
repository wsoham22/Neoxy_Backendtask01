// mediaController.js
const cloudinary = require('./config'); 
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 

exports.uploadProfileImage = async (req, res) => {
    try {
        upload.single('image')(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ error: 'Error uploading file' });
            }
            const result = await cloudinary.uploader.upload(req.file.path, { folder: 'users_profile' });
            res.status(200).json({ message: 'Profile image uploaded successfully', url: result.secure_url });
        });
    } catch (error) {
        console.error('Error uploading profile image:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
