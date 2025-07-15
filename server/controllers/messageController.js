import Message from "../models/message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import {io, userSocketMap} from '../server.js';


// Get all user expect the logger in user;
export const getUserForSidebar = async (req, res) => {
    try {
        const userId = req.user._id;
        const filterUsers = await User.find({ _id: { $ne: userId } })
            .select("-password");

        //Count number of message not seen
        const unseenMessages = {}
        const promises = filterUsers.map(async (user) => {
            const messages = await Message.find({
                senderId: user._id, receiverId:
                    userId, seen: false
            });

            if (messages.length > 0) {
                unseenMessages[user._id] = messages.length;
            }
        })
        await Promise.all(promises);
        res.json({ success: true, users: filterUsers, unseenMessages })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, messages : error.message })
    }
}


// Get all message for selected User
export const getMessages = async (req, res) => {
    try {
        const { id: selectedUserId } = req.params;
        const myId = req.user._id;

        const message = await Message.find({
            $or: [
                { senderId: myId, receiverId: selectedUserId },
                { senderId: selectedUserId, receiverId: myId }
            ]

        })

        await Message.updateMany({ senderId: selectedUserId, receiverId: myId },
            { seen: true });
        res.json({ success: true, messages: message })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, messages: error.message })
    }
}

// api to mark message as seen using message id 
export const markMessageAsSeen = async (req, res) => {
    try {
        const {id} = req.params;
        await Message.findByIdAndUpdate(id,{seen:true});
        res.json({success:true})

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, messages: error.message })
    }
}

// Send message to selected user
export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            const upload = await cloudinary.uploader.upload(image);
            imageUrl = upload.secure_url;
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });

        // Emit the new Message to BOTH sender and receiver
        const receiverSocketId = userSocketMap[receiverId];
        const senderSocketId = userSocketMap[senderId];

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        if (senderSocketId && senderSocketId !== receiverSocketId) {
            io.to(senderSocketId).emit("newMessage", newMessage);
        }

        res.json({ success: true, newMessage });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, messages: error.message });
    }
};
