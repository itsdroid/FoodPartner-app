const User = require('../models/user.model');
const FoodPartner = require('../models/foodPartner.model');
const bcrypt = require('bcrypt');
const storageService = require('../services/storage.service');
const { v4: uuid } = require('uuid');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require("dotenv").config();
const JWT_KEY = process.env.JWT_KEY || 'fallback_jwt_secret_key_for_development';

// ====== user register ===========
async function registerUser(req, res) {
    try {
        const { name, email, password } = req.body;
        const isAlreadyExists = await User.findOne({ email });

        if (isAlreadyExists) {
            return res.status(400).json({ message: "User already exists. Please login instead." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashedPassword
        })

        await user.save();
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    }
    catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: "Registration failed. Please try again." });
    }
}
//======================================================================

// ================= login user ========================

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found. Please register first." });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ id: user._id }, JWT_KEY);

        res.cookie("token", token, {
            httpOnly: true, // prevents access from JS (protects from XSS)
            secure: false,  // set true if using HTTPS
            sameSite: "strict",
        });

        res.status(200).json({
            message: `Welcome back, ${user.name}!`,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            token: token
        });
    }
    catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: "Login failed. Please try again." });
    }
}
//======================================================================

// =====================register foodpartner ====================
async function registerFoodPartner(req, res) {
    try {
        const { name, email, password, contactName, phone, address } = req.body;
        const isAlreadyExistsFoodPartner = await FoodPartner.findOne({ email });

        if (isAlreadyExistsFoodPartner) {
            return res.status(400).json({ message: "FoodPartner already exists. Please login instead." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate unique partner token
        const partnerToken = crypto.randomBytes(16).toString('hex');

        const foodPartner = new FoodPartner({
            name,
            contactName,
            phone,
            address,
            email,
            password: hashedPassword,
            partnerToken: partnerToken
        })

        await foodPartner.save();
        res.status(201).json({
            message: "Food partner registered successfully",
            foodPartner: {
                id: foodPartner._id,
                name: foodPartner.name,
                email: foodPartner.email,
                partnerToken: foodPartner.partnerToken
            }
        });
    }
    catch (err) {
        console.error('Partner registration error:', err);
        res.status(500).json({ message: "Registration failed. Please try again." });
    }
}

//======================================================================

// =====================login foodpartner ====================

async function loginFoodPartner(req, res) {
    try {
        console.log('loginFoodPartner called with:', req.body);
        const { email, password } = req.body;

        const foodPartner = await FoodPartner.findOne({ email });
        console.log('Food partner found:', !!foodPartner);

        if (!foodPartner) {
            return res.status(400).json({ message: "Food partner not found. Please register first." });
        }

        const isMatch = await bcrypt.compare(password, foodPartner.password);
        console.log('Password match:', isMatch);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        console.log('JWT_KEY:', JWT_KEY ? 'exists' : 'missing');
        const token = jwt.sign({ id: foodPartner._id }, JWT_KEY);
        console.log('Token generated:', token ? token.substring(0, 20) + '...' : 'none');

        res.cookie("token", token, {
            httpOnly: true, // prevents access from JS (protects from XSS)
            secure: false,  // set true if using HTTPS
            sameSite: "strict",
        });

        res.status(200).json({
            message: `Welcome back, ${foodPartner.name}!`,
            foodPartner: {
                id: foodPartner._id,
                name: foodPartner.name,
                email: foodPartner.email,
            },
            token: token
        });
    }
    catch (err) {
        console.error('Partner login error:', err);
        res.status(500).json({ message: "Login failed. Please try again." });
    }
}
//======================================================================

// =====================logout user ====================

async function logoutUser(req, res) {
    res.clearCookie("token");
    res.status(200).json({
        message: "User logged out successfully !"
    });
}

//======================================================================

// =====================logout foodPartner ====================
async function logoutfoodPartner(req, res) {
    res.clearCookie("token");
    res.status(200).json({
        message: "Food partner logged out successfully !"
    });
}

// =====================register restaurant ====================
async function registerRestaurant(req, res) {
    try {
        console.log('registerRestaurant called with body:', req.body);
        console.log('registerRestaurant foodPartner:', req.foodPartner);
        console.log('registerRestaurant file:', req.file ? { fieldname: req.file.fieldname, size: req.file.size } : 'no file');

        const { name, description, cuisine, location } = req.body;
        const foodPartnerId = req.foodPartner?.id;

        if (!foodPartnerId) {
            return res.status(401).json({ message: "Food partner authentication required" });
        }

        const foodPartner = await FoodPartner.findById(foodPartnerId);
        if (!foodPartner) {
            return res.status(404).json({ message: "Food partner not found" });
        }

        if (foodPartner.restaurant.isRegistered) {
            return res.status(400).json({ message: "Restaurant already registered for this partner" });
        }

        let imageUrl = '';

        // Handle image upload if provided (mirror video storage logic)
        if (req.file && req.file.buffer) {
            try {
                const uploadResult = await storageService.uploadFile(req.file.buffer, uuid());
                imageUrl = uploadResult.url;
            } catch (uploadErr) {
                console.error('Restaurant image upload error:', uploadErr);
                // Not a hard failure for registration; continue without image
            }
        }

        foodPartner.restaurant = {
            name,
            description,
            cuisine,
            location,
            image: imageUrl,
            isRegistered: true,
            registrationDate: new Date()
        };

        await foodPartner.save();

        res.status(201).json({
            message: "Restaurant registered successfully",
            restaurant: foodPartner.restaurant
        });
    } catch (err) {
        console.error('Restaurant registration error:', err);
        res.status(500).json({ message: "Restaurant registration failed. Please try again." });
    }
}

// Public: list registered restaurants
async function listRestaurants(req, res) {
    try {
        const partners = await FoodPartner.find({ 'restaurant.isRegistered': true })
            .select('name contactName restaurant');

        const restaurants = partners.map(p => ({
            id: p._id,
            partnerName: p.name,
            contactName: p.contactName,
            name: p.restaurant?.name || '',
            description: p.restaurant?.description || '',
            cuisine: p.restaurant?.cuisine || '',
            location: p.restaurant?.location || '',
            image: p.restaurant?.image || '',
            registrationDate: p.restaurant?.registrationDate || null
        }));

        res.status(200).json({
            message: 'Restaurants fetched successfully',
            restaurants
        });
    } catch (err) {
        console.error('List restaurants error:', err);
        res.status(500).json({ message: 'Failed to fetch restaurants' });
    }
}

// =====================get partner profile ====================
async function getPartnerProfile(req, res) {
    try {
        const foodPartnerId = req.foodPartner?.id;

        if (!foodPartnerId) {
            return res.status(401).json({ message: "Food partner authentication required" });
        }

        const foodPartner = await FoodPartner.findById(foodPartnerId).select('-password');
        if (!foodPartner) {
            return res.status(404).json({ message: "Food partner not found" });
        }

        res.status(200).json({
            message: "Partner profile fetched successfully",
            foodPartner
        });
    } catch (err) {
        console.error('Get partner profile error:', err);
        res.status(500).json({ message: "Failed to fetch partner profile" });
    }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    registerFoodPartner,
    loginFoodPartner,
    logoutfoodPartner,
    registerRestaurant,
    getPartnerProfile,
    listRestaurants,
};