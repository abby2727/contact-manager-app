const express = require('express');
const router = express.Router();
const {
	registerUser,
	currentUser,
	loginUser
} = require('../controllers/userController');

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/current', currentUser);

module.exports = router;
