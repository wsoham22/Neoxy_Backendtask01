
const Course = require("./coursemodel");
const APIFeatures = require("./../../utils/APIFeatures");
const User = require("./usermodel")
const jwt = require("jsonwebtoken")
const mail = require("./../../utils/mail")
require("dotenv").config();
exports.getAllCourses = async (req, res) => {
    try {
        const features = new APIFeatures(Course.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .pagination();

        const courses = await features.query;
        res.status(200).json(courses);
    } catch (error) {
        console.error('Error retrieving courses:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.createCourse = async (req, res) => {
    try {
        const { title, description, category, level, instructor, duration, price } = req.body;
        const course = new Course({ title, description, category, level, instructor, duration, price });
        await course.save();
        await mail.sendWelcomeEmail('admin@example.com');
        res.status(201).json({ message: 'Course created successfully' });
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (error) {
        console.error('Error retrieving course:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.deleteCourseById = async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.updateCourseById = async (req, res) => {
    try {
        await Course.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json({ message: 'Course updated successfully' });
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.enrollCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const token = req.headers.authorization.split(' ')[1]; // Extract JWT token from Authorization header
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verify and decode the JWT token
        const userId = decodedToken.userId; // Extract user ID from the decoded token

        // Check if the user is already enrolled in the course
        const user = await User.findById(userId).populate('enrolledCourses');
        if (user.enrolledCourses.some(course => course._id.equals(courseId))) {
            return res.status(400).json({ error: 'You are already enrolled in this course' });
        }

        // Enroll the user in the course
        user.enrolledCourses.push(courseId);
        await user.save();
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        const title = course.title;
        await mail.sendEnrollmentConfirmation(user.email,title);
        console.log(user.email);
        console.log(courseId);
        res.status(200).json({ message: 'Successfully enrolled in the course' });
    } catch (error) {
        console.error('Error enrolling in course:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.viewEnrolledCourses = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Extract JWT token from Authorization header
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verify and decode the JWT token
        const userId = decodedToken.userId; // Assuming userId is stored in the JWT payload

        // Fetch the user's enrolled courses
        const user = await User.findById(userId).populate('enrolledCourses');
        const enrolledCourses = user.enrolledCourses;

        res.status(200).json({ enrolledCourses });
    } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};