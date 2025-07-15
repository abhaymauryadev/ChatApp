import User from "../models/User.js";
import jwt from "jsonwebtoken";



// Middleware to protect routes
export const protectRoute = async (req, res, next) => {
    try {
        const token = req.headers.token?.replace('Bearer ', '');
        const decode = jwt.verify(token, process.env.SecretKey);

        const user = await User.findById(decode.userId).select("-password");

        if (!user) return res.json({ success: false, message: "User not found" })

        req.user = user;
        next();
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: "User not found" })

    }
}