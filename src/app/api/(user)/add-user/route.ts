import dbConnect from "@/lib/dbConnect";
import { sendResponse } from "@/utils/sendResponse";
import bcrypt from "bcrypt" 
import UserModel from "@/models/User.model";

export async function POST(request: Request){
    await dbConnect();

    try {
        const {name, email, phone, password} = await request.json();
        if([name, email, phone, password].some(field => field.trim().length === 0)){
            return sendResponse(false, "All fields are required", 400);
        }

        const exisitingUser = await UserModel.findOne({
            $or: [{email}, {phone}]
        })

        if(exisitingUser) return sendResponse(false, "User already exists", 409);

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({
            name,
            email,
            phone,
            password: hashedPassword
        })

        await newUser.save();
        const createdUser = await UserModel.findById(newUser._id).select("-password");
        if(!createdUser) return sendResponse(false, "Falied to create user", 500);

        return sendResponse(true, "User created", 201, createdUser);
    } catch (error) {
        console.error(error);
        return sendResponse(false, "Failed to create user", 500)
    }
} 