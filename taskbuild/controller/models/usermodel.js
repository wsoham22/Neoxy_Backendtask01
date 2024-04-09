const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const fs = require('fs');
const settings = JSON.parse(fs.readFileSync('C:/Neoxy/taskbuild/controller/models/imagesettings.json', 'utf8'));
cloudinary.config(settings.cloudinary);
// Define Mongoose Schema for User
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        maxlength: 50,
        required: true
    },
    image:{
        type:String
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
        ref: 'Course' // Reference to the Course model
    }]
},{ strictPopulate: false });
// Middleware to handle image uploading
userSchema.pre('save', async function(next) {
    if (!this.isModified('image')) {
        return next();
    }
    try {
        // Upload image to Cloudinary
        const uploadedImage = await cloudinary.uploader.upload(this.image, { folder: 'users_profile' });
        // Update user's image field with the Cloudinary URL
        this.image = uploadedImage.secure_url;
        next();
    } catch (error) {
        next(error);
    }
});
const User = mongoose.model('NeoxyUser', userSchema);
module.exports = User;
