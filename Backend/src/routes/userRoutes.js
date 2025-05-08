const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/userMiddleware');

router.post('/register', userController.registerUser);

router.post('/login', userController.loginUser);

router.post("/logout", userController.postLogout);

module.exports = router;
