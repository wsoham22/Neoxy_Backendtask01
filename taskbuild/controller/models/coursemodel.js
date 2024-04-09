// coursemodel.js

const mongoose = require("mongoose");

// Define Mongoose Schema for Course
const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['Math', 'Science', 'History', 'Programming', 'Art', 'Music'],
        required: true
    },
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        required: true
    },
    instructor: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true // Duration in minutes
    },
    price: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        default: 0
    }
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
