const jwt = require('jsonwebtoken');
const { findById } = require('../models/user.model');
require("dotenv").config();
const JWT_KEY = process.env.JWT_KEY || 'fallback_jwt_secret_key_for_development';
const User = require('../models/user.model');
const FoodPartner = require('../models/foodPartner.model');

async function authMiddleware(req, res, next) {
    // Check for token in Authorization header or cookies
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.slice(7)
        : req.cookies.token;

    console.log('authMiddleware - authHeader:', authHeader);
    console.log('authMiddleware - token:', token ? token.substring(0, 20) + '...' : 'none');
    console.log('authMiddleware - JWT_KEY:', JWT_KEY ? 'exists' : 'missing');

    if (!token) {
        console.log('authMiddleware - No token found');
        return res.status(401).json({ message: "access denied - no token" });
    }
    try {
        const decoded = jwt.verify(token, JWT_KEY);
        console.log('authMiddleware - decoded:', decoded);

        const user = await User.findById(decoded.id).select("-password");
        console.log('authMiddleware - user found:', !!user);

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        next();
    }
    catch (err) {
        console.log('authMiddleware - JWT error:', err.message);
        return res.status(401).json({ message: "invalid or expired session" });
    }
};


async function authFoodPartnerMiddleware(req, res, next) {
    // Check for token in Authorization header or cookies
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.slice(7)
        : req.cookies.token;

    console.log('authFoodPartnerMiddleware - authHeader:', authHeader);
    console.log('authFoodPartnerMiddleware - token:', token ? token.substring(0, 20) + '...' : 'none');
    console.log('authFoodPartnerMiddleware - JWT_KEY:', JWT_KEY ? 'exists' : 'missing');

    if (!token) {
        console.log('authFoodPartnerMiddleware - No token found');
        return res.status(401).json({ message: "access denied - no token" });
    }
    try {
        const decoded = jwt.verify(token, JWT_KEY);
        console.log('authFoodPartnerMiddleware - decoded:', decoded);

        const foodPartner = await FoodPartner.findById(decoded.id).select("-password");
        console.log('authFoodPartnerMiddleware - foodPartner found:', !!foodPartner);

        if (!foodPartner) {
            return res.status(401).json({ message: "Food partner not found" });
        }

        req.foodPartner = foodPartner;
        next();
    }
    catch (err) {
        console.log('authFoodPartnerMiddleware - JWT error:', err.message);
        return res.status(401).json({ message: "invalid or expired session" });
    }
};




module.exports = { authMiddleware, authFoodPartnerMiddleware };