const express = require("express");
const router = express.Router();
const CourseController = require("./../controller/models/coursecontroller");
const adminAuthMiddleware = require("../auth/adminauth").adminAuthMiddleware;

// Create a new course
router.post('/create', adminAuthMiddleware, CourseController.createCourse);

// Get all courses
router.get('/getAllCourses', CourseController.getAllCourses);

// Get course by ID
router.get('/getCourse/:id', CourseController.getCourseById);

// Delete course by ID
router.delete('/deleteCourse/:id', adminAuthMiddleware, CourseController.deleteCourseById);

// Update course by ID (partial update)
router.patch('/updateCourse/:id', adminAuthMiddleware, CourseController.updateCourseById);

// Enroll in a course
router.post('/enroll/:courseId', CourseController.enrollCourse);

// View enrolled courses
router.get('/viewEnrolledCourses', CourseController.viewEnrolledCourses);
//password reset request via email


module.exports = router;
