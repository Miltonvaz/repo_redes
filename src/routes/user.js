const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, uploadVideo, getAllVideos } = require('../controller/userController'); 
const { verifyToken } = require('../middleware/auth');
const { upload } = require('../middleware/video'); 

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', verifyToken, getUserProfile);
router.post('/upload-video', verifyToken, upload.single('video'), uploadVideo);
router.get('/videos', verifyToken, getAllVideos); // Endpoint para obtener todos los videos

module.exports = { userRoutes: router };
