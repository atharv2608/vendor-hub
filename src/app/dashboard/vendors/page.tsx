"use client";
import { AddVendor } from "@/components/vendors/AddVendor";
import VendorTable from "@/components/vendors/VendorTable";
import React from "react";

function page() {
  return (
    <main className="dark:bg-gray-900 p-4 h-full">
      <div className="space-y-5">
        <div>
          <AddVendor />
        </div>
        <div>
          <VendorTable showActions={true} />
        </div>
      </div>
    </main>
  );
}

export default page;
