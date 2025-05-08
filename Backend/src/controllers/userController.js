const { generateToken } = require('../middleware/userMiddleware');
const User = require('../models/user');
const bcrypt = require('bcrypt');

registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ name, email, password: hashedPassword });
        res.status(201).json({ message: 'User registered successfully', success:true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ success: false,message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false,message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false,message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = generateToken({ id: user.id, email: user.email });

        res.status(200).json({ 
        message: 'Login successful',
        success: true, 
        token, 
        user:{
            email: user.email,
            name: user.name,
            _id: user._id
        }
    });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

getUserProfile = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById({id}).select('-password'); 
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const postLogout = async (req, res) => {
    try {
        res.status(200).json({ message: "Logout successful", success: true });
    } catch (error) {
        res.status(500).send({ message: "Internal server error", success: false });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    postLogout
}