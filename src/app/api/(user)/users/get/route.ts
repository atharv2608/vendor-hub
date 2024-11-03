import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { sendResponse } from "@/utils/sendResponse";
import { getServerSession } from "next-auth";

export const dynamic = "force-dynamic"
export async function GET() {
  await dbConnect();
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return sendResponse(false, "Unauthenticated request", 401);
    }
    const users = await UserModel.find().select("-password");
    if (!users) {
      return sendResponse(false, "No users found", 404);
    }
    return sendResponse(true, "Users found", 200, users);
  } catch (error) {
    console.error("Error getting users information:", error);
    return sendResponse(
      false,
      "An error occurred while getting users information",
      500
    );
  }
}
