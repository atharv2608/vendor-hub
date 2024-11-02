import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import VendorModel from "@/models/Vendor.model";
import { sendResponse } from "@/utils/sendResponse";
import { getServerSession, User } from "next-auth";

export async function PUT(request: Request){

    try {
        await dbConnect();
        const session = await getServerSession(authOptions)
        const user: User = session?.user as User;
        // if(!session || !session.user) {
        //     return sendResponse(false, "Unauthenticated request", 401);
        // };
        // if (!user.canManageVendors) {
        //     return sendResponse(false, "Unauthorized request", 403);
        //   }
        const {_id, criticality, contact, accountStatus} = await request.json();
        if([_id, criticality, contact, accountStatus].some(field => field.trim().length ===0)){
            return sendResponse(false, "All fields are required", 400);
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