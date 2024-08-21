const express = require("express");
const router = express.Router();
const UserController = require("../controller/models/usercontroller");
const adminAuthMiddleware = require("../auth/adminauth").adminAuthMiddleware
const mediaController = require('./../controller/mediaController');


router.post('/signup', UserController.createUser);
router.post('/requestresetPassword',UserController.requestPasswordReset);
router.post('/upload-profile-image', mediaController.uploadProfileImage);
router.post('/resetpassword', UserController.resetPassword);
router.post('/login', UserController.loginUser);
router.use(adminAuthMiddleware);
router.get('/getAllUsers',UserController.getAllUsers);
// Delete user by ID
router.delete('/deleteuser/:id', UserController.deleteUserById);
router.get('/getuser/:id', UserController.getUserById);
// Update user by ID (replace all fields)
router.put('/updateall/:id', UserController.updateUserById);

// Update user by ID (partial update)
router.patch('/updateuser/:id', UserController.partialUpdateUserById);

module.exports = router;