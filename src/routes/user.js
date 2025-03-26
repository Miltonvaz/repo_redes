const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, uploadVideo } = require('../controller/userController'); 
const { verifyToken } = require('../middleware/auth');
const { upload } = require('../middleware/video'); 

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', verifyToken, getUserProfile);
router.post('/upload-video', verifyToken, upload.single('video'), uploadVideo); 


module.exports = { userRoutes: router };
