import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";



// SignUp a new User
export const Signup = async (req, res) => {
    const { fullName, email, password, bio } = req.body;

    try {
        if (!fullName || !email || !password || !bio) {
            return res.json({ success: false, message: "Missing Details" })
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.json({ success: false, message: "User already exists" })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
            bio
        })

        const token = generateToken(newUser._id)

        res.json({ success: true, userData: newUser, token, message: "Account created Successfully" })

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}


// Controller to login a user

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userData = await User.findOne({ email });

        const isPasswordCorrect = await bcrypt.compare(password, userData.password);
        if (!isPasswordCorrect) {
            return res.json({ success: false, message: "Invalid Credentials" })
        }
        const token = generateToken(userData._id)

        res.json({ success: true, userData, token, message: "Login Successfully" })

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}


// Controller to Check if user is authenticated
export const checkAuth =( req, res)=>{
    res.json({success:true,user: req.user});
}

// Controller to update user profile details
export const updateProfile = async(req, res)=>{
    try {
        const {profilePic, bio, fullName}= req.body;
        const userId = req.user._id;

        if (!fullName || !bio) {
            return res.json({ success: false, message: "Full name and bio are required" });
        }

        let updateUser;

        if(!profilePic){
            updateUser = await User.findByIdAndUpdate(userId,{bio, fullName},
                {new:true});
        }else{
            try {
                const upload = await cloudinary.uploader.upload(profilePic);
                updateUser  = await User.findByIdAndUpdate(userId,{profilePic:upload.secure_url, bio,fullName},
                    {new:true});
            } catch (cloudinaryError) {
                console.log("Cloudinary upload failed:", cloudinaryError.message);
                // If Cloudinary fails, update without profile picture
                updateUser = await User.findByIdAndUpdate(userId,{bio, fullName},
                    {new:true});
            }
        }

        if (!updateUser) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({success:true, user: updateUser})
    } catch (error) {
        console.log("Profile update error:", error.message); 
        res.json({success:false, message: error.message})
    }
}