import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import VendorModel from "@/models/Vendor.model";
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

    if (!user.canManageVendors) {
      return sendResponse(false, "Unauthorized request", 403);
    }
    const { _id } = await request.json();
    if (!_id) {
      return sendResponse(false, "ID is required", 400);
    }

    const deletedVendor = await VendorModel.findByIdAndDelete(_id);
    if (!deletedVendor) {
      return sendResponse(false, "Vendor not found", 404);
    }
    return sendResponse(true, "Vendor deleted", 200);
  } catch (error) {
    console.error("Error while deleting vendor", error);
    return sendResponse(false, "Failed to delete vendor", 500);
  }
}
