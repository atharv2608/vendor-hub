import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { sendResponse } from "@/utils/sendResponse";
import { getServerSession, User } from "next-auth";

export async function DELETE(request: Request) {
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
    const { _id } = await request.json();
    if (!_id) {
      return sendResponse(false, "Id is required", 400);
    }

    if (user._id == _id) {
      return sendResponse(false, "You cannot delete yourself", 400);
    }

    const deletedUser = await UserModel.findByIdAndDelete(_id);
    if (!deletedUser) {
      return sendResponse(false, "User not found", 404);
    }
    return sendResponse(true, "User deleted", 200);
  } catch (error) {
    console.log("Error deleting user: ", error);
    return sendResponse(false, "Error deleting user", 500);
  }
}
