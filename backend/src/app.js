const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./db/db');
const authRoutes = require('./routes/auth.routes');
const cookieParser = require('cookie-parser');
const { authMiddleware, authFoodPartnerMiddleware } = require('./middleware/authMiddleware');
const User = require('./models/user.model');
const foodRouter = require('./routes/food.routes');
const analyticsRouter = require('./routes/analytics.routes');
const userInteractionRouter = require('./routes/userInteraction.routes');


connectDB();

// Add CORS configuration for local and deployed frontends
const allowedOrigins = [
    process.env.FRONTEND_ORIGIN,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow mobile apps / curl with no origin, or explicitly allowed origins
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Type']
}));

// Handle preflight
// Preflight is handled by the global CORS middleware above

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send("working !");
})
app.get('/test', (req, res) => {
    res.send("working !");
})

app.get('/test-partner-auth', authFoodPartnerMiddleware, (req, res) => {
    res.json({
        message: "Partner auth test successful",
        partner: {
            id: req.foodPartner._id,
            name: req.foodPartner.name,
            email: req.foodPartner.email
        }
    });
})

app.get('/profile', authMiddleware, async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");
    console.log(req.user);
    res.send(`welcome ${user.name}`);
})
app.use('/', authRoutes);
app.use('/food', foodRouter);
app.use('/analytics', analyticsRouter);
app.use('/user', userInteractionRouter);
module.exports = app;