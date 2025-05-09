import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protectRoute = async (req, res, next) => {
    try{
        const authHeader = req.headers["authorization"] || req.headers["Authorization"];

        
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            
            return res.status(401).json({ message: "Unauthorized" });
        }

        const token = authHeader.replace("Bearer ", "");

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select("-password");
        if(!user){
            return res.status(401).json({message: 'Unauthorized'});
        }
        req.user = user;
        next();
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: 'Server error'});
    }
}


export default protectRoute;