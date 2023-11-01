const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// @route POST /api/users/register
// @access public
const registerUser = asyncHandler(async (req, res) => {
	const { username, email, password } = req.body;
	if (!username || !email || !password) {
		res.status(400);
		throw new Error('Please fill all the fields');
	}

	const userAvailable = await User.findOne({ email });
	if (userAvailable) {
		res.status(400);
		throw new Error('User already exists');
	}

	const hashedPassword = await bcrypt.hash(password, 10);
	const user = await User.create({
		username,
		email,
		password: hashedPassword
	});
	if (!user) {
		res.status(400);
		throw new Error('Invalid user data');
	}

	res.status(201).json({
		_id: user._id,
		username: user.username,
		email: user.email
	});
});

// @route POST /api/users/login
// @access public
const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		res.status(400);
		throw new Error('Please fill all the fields');
	}

	const user = await User.findOne({ email });
	if (user && (await bcrypt.compare(password, user.password))) {
		const accessToken = jwt.sign(
			{
				user: {
					_id: user._id,
					username: user.username,
					email: user.email
				}
			},
			process.env.JWT_SECRET,
			{
				expiresIn: '30m'
			}
		);
		res.status(200).json({ accessToken });
	} else {
		res.status(401);
		throw new Error('Invalid email or password');
	}
});

// @route GET /api/users/current
// @access private
const currentUser = asyncHandler(async (req, res) => {
	res.status(200).json(req.user);
});

module.exports = { registerUser, loginUser, currentUser };
