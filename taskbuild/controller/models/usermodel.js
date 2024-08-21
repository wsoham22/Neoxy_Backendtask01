const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const path = require('path');
const fs = require('fs');

// Construct the path to the JSON file one directory up
const settingsPath = path.join(__dirname, '..', 'imagesettings.json');
let settings;
try {
    settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
} catch (error) {
    console.error('Error reading or parsing settings file:', error);
    process.exit(1);
}

// Configure Cloudinary
cloudinary.config(settings.cloudinary);

// Define the user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        maxlength: 50,
        required: true
    },
    image: {
        type: String
    },
    email: {
        type: String,
        maxlength: 25,
        minlength: 10,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'superadmin'],
        default: 'user'
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    enrolledCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course' 
    }]
}, { strictPopulate: false });

// // Middleware to handle image uploading
// userSchema.pre('save', async function(next) {
//     if (!this.isModified('image') || !this.image) {
//         return next();
//     }
//     try {
//         const uploadedImage = await cloudinary.uploader.upload(this.image, { folder: 'users_profile' });
//         this.image = uploadedImage.secure_url; 
//         next(); 
//     } catch (error) {
//         console.error('Error uploading image to Cloudinary:', error);
//         next(error);
//     }
// });

const User = mongoose.model('NeoxyUser', userSchema);
module.exports = User;
