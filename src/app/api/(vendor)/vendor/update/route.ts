import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import VendorModel from "@/models/Vendor.model";
import { sendResponse } from "@/utils/sendResponse";
import { getServerSession, User } from "next-auth";

export async function PUT(request: Request){

    try {
        await dbConnect();
        const session = await getServerSession(authOptions)
        const user: User = session?.user as User;
        if(!session || !session.user) {
            return sendResponse(false, "Unauthenticated request", 401);
        };
        if (!user.canManageVendors) {
            return sendResponse(false, "Unauthorized request", 403);
          }
        const {_id, criticality, contact, accountStatus} = await request.json();
        if([_id, criticality, contact, accountStatus].some(field => field.trim().length ===0)){
            return sendResponse(false, "All fields are required", 400);
        }   

        const existingUser = await UserModel.findOne({email: contact})
        if(existingUser){
            return sendResponse(false, "System User with similar email already exist", 409);
        }
        const otherVendorWithSameContact = await VendorModel.findOne({
            _id: { $ne: _id },
            contact,
        })

        if(otherVendorWithSameContact){
            return sendResponse(false, "Another vendor with the same contact already exists", 409);
        }
        const updatedVendor = await VendorModel.findByIdAndUpdate(
            _id,
            {
                criticality,
                contact,
                accountStatus
            },
            { new: true }
        )

        if(!updatedVendor) {
            return sendResponse(false, "Vendor not found", 404);
        }
        return sendResponse(true, "Vendor updated", 200,  updatedVendor);
    } catch (error) {
        console.error("Error updating vendor", error);
        return sendResponse(false, "Failed to update vendor", 500);
    }
}