import dbConnect from "@/lib/dbConnect";
import { sendResponse } from "@/utils/sendResponse";
import bcrypt from "bcrypt";
import UserModel from "@/models/User.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if (!session || !session.user) {
      return sendResponse(false, "Unauthenticated request", 401);
    }

    if (!user.canManageUsers) {
      return sendResponse(false, "Unauthorized request", 403);
    }
    const { name, email, phone, password, canManageVendors, canManageUsers } =
      await request.json();
    if (
      [name, email, phone, password].some(
        (field) => field === "" || field === null || field === undefined
      )
    ) {
      return sendResponse(false, "All fields are required", 400);
    }

    const exisitingUser = await UserModel.findOne({
      $or: [{ email }, { phone }],
    });

    if (exisitingUser) return sendResponse(false, "User already exists", 409);

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      name,
      email,
      phone,
      password: hashedPassword,
      canManageVendors,
      canManageUsers,
    });

    await newUser.save();
    const createdUser = await UserModel.findById(newUser._id).select(
      "-password"
    );
    if (!createdUser) return sendResponse(false, "Falied to create user", 500);

    return sendResponse(true, "User created", 201, createdUser);
  } catch (error) {
    console.error(error);
    return sendResponse(false, "Failed to create user", 500);
  }
}
