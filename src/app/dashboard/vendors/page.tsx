"use client";
import { AddVendor } from "@/components/vendors/AddVendor";
import DownloadReport from "@/components/vendors/DownloadReport";
import VendorTable from "@/components/vendors/VendorTable";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import React from "react";

function page() {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  return (
    <main className="dark:bg-gray-900 p-4 h-full">
      <div className="space-y-5">
        {user?.canManageVendors && (
          <div>
            <AddVendor />
          </div>
        )}
        <div>
          <VendorTable showActions={true} />
        </div>
        <div>
          <DownloadReport />
        </div>
      </div>
    </main>
  );
}

export default page;
