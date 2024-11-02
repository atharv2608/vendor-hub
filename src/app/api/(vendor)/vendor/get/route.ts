import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import VendorModel from "@/models/Vendor.model";
import { sendResponse } from "@/utils/sendResponse";
import { getServerSession, User } from "next-auth";

export async function GET(request: Request) {
  await dbConnect();
  try {
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if (!session || !session.user) {
      return sendResponse(false, "Unauthenticated request", 401);
    }
    const vendors = await VendorModel.find();
    if (!vendors) {
      return sendResponse(false, "No vendors found", 404);
    }
    return sendResponse(true, "Vendors found", 200, vendors);
  } catch (error) {
    console.error("Error getting vendors information");
    return sendResponse(
      false,
      "An error occurred while getting vendors information",
      500
    );
  }
}
