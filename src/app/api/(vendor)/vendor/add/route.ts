import dbConnect from "@/lib/dbConnect";
import VendorModel from "@/models/Vendor.model";
import { sendResponse } from "@/utils/sendResponse";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/options";
import UserModel from "@/models/User.model";

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !session.user) {
    return sendResponse(false, "Unauthenticated request", 401);
  }
  if (!user.canManageVendors) {
    return sendResponse(false, "Unauthorized request", 403);
  }
  try {
    const { name, type, criticality, contact, serviceProvided } =
      await request.json();
      if (
        [name, type, criticality, contact, serviceProvided].some(
          (field) => field === "" || field === null || field === undefined
        )
      ) {
        return sendResponse(false, "All fields are required", 400);
      }

    const existingVendor = await VendorModel.findOne({ contact });
    if (existingVendor) {
      return sendResponse(
        false,
        "Vendor with the same contact already exists",
        409
      );
    }

    const existingUser = await UserModel.findOne({email: contact});
    if(existingUser){
      return sendResponse(false, "Similar email is registered in users", 409)
    }

    const newVendor = new VendorModel({
      name,
      type,
      criticality,
      contact,
      serviceProvided
    });

    await newVendor.save();
    const createdVendor = await VendorModel.findById(newVendor._id);
    if (!createdVendor)
      return sendResponse(false, "Failed to create vendor", 500);

    return sendResponse(true, "Vendor created", 201, createdVendor);
  } catch (error) {
    console.error("Error creating vendor", error);
    return sendResponse(false, "Failed to create vendor", 500);
  }
}
