"use client";
import React, { useMemo, useState } from "react";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table,
} from "../ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import { Badge } from "../ui/badge";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AccountStatus, CriticalityStatus, Vendor } from "@/types";
import { ApiResponse } from "@/types/ApiResponse";
import { Skeleton } from "../ui/skeleton";
import { UpdateVendor } from "./UpdateVendor";
import { DeleteVendor } from "./DeleteVendor";
import { User } from "next-auth";
import { useSession } from "next-auth/react";

export const fetchVendors = async (): Promise<Vendor[] | undefined> => {
  const response = await axios.get<ApiResponse>("/api/vendor/get");
  return (response.data.data as Vendor[]) || [];
};
function VendorTable({ showActions }: { showActions: boolean }) {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isPending, isError } = useQuery({
    queryKey: ["vendorsQueryKey"],
    queryFn: fetchVendors,
  });

  const filteredVendors = useMemo(() => {
    return data?.filter(
      (vendor) =>
        vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.serviceProvided.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const getCriticalityColor = (criticality: string) => {
    switch (criticality.toLowerCase()) {
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      case "pending":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Vendors</CardTitle>
        <CardDescription>
          A list of recent vendors added to your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Label htmlFor="search" className="text-gray-700 dark:text-gray-300">
            Search Vendors
          </Label>
          <div className="flex mt-1">
            <Input
              id="search"
              type="text"
              placeholder="Search by name, type, or service"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            <Button className="ml-2 bg-blue-700 hover:bg-blue-800 text-white">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          {isError ? (
            <h1 className="text-3xl dark:text-white">Error Fetching Vendors</h1>
          ) : isPending ? (
            <Skeleton className="h-[125px] w-full rounded-xl" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-700 dark:text-gray-300">
                    Name
                  </TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">
                    Type
                  </TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">
                    Criticality
                  </TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">
                    Status
                  </TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">
                    Contact
                  </TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">
                    Service Provided
                  </TableHead>
                  {showActions && user?.canManageVendors && (
                    <TableHead className="text-gray-700 dark:text-gray-300">
                      Actions
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVendors?.map((vendor: Vendor) => (
                  <TableRow
                    key={vendor._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                      {vendor.name}
                    </TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">
                      {vendor.type}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${getCriticalityColor(vendor.criticality)}`}
                      >
                        {vendor.criticality}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${getStatusColor(vendor.accountStatus)}`}
                      >
                        {vendor.accountStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">
                      {vendor.contact}
                    </TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">
                      {vendor.serviceProvided}
                    </TableCell>
                    {showActions && user?.canManageVendors && (
                      <TableCell>
                        <UpdateVendor
                          _id={vendor._id}
                          criticality={vendor.criticality as CriticalityStatus}
                          accountStatus={vendor.accountStatus as AccountStatus}
                          contact={vendor.contact}
                        />
                      </TableCell>
                    )}

                    {showActions && user?.canManageVendors && (
                      <TableCell>
                        <DeleteVendor _id={vendor._id as string} />
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default VendorTable;
