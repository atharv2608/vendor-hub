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
import { Ban, Check, Search } from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { User } from "@/types";
import { ApiResponse } from "@/types/ApiResponse";
import { Skeleton } from "../ui/skeleton";
import { useSession } from "next-auth/react";
import { User as NextUser } from "next-auth";
import { DeleteUser } from "./DeleteUser";
export const fetchUsers = async (): Promise<User[] | undefined> => {
  const response = await axios.get<ApiResponse>("/api/users/get");
  return (response.data.data as User[]) || [];
};
function UserTable() {
  const { data: session } = useSession();
  const user: NextUser = session?.user as NextUser;
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isPending, isError } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const filteredUsers = useMemo(() => {
    return data?.filter(
      (u) =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>User</CardTitle>
        <CardDescription>A list of users in the system.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Label htmlFor="search" className="text-gray-700 dark:text-gray-300">
            Search Users
          </Label>
          <div className="flex mt-1">
            <Input
              id="search"
              type="text"
              placeholder="Search by name, email, or phone"
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
            <h1 className="text-3xl dark:text-white">Error Fetching Users</h1>
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
                    Email
                  </TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">
                    Phone
                  </TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">
                    Manage Users
                  </TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300">
                    Manage Vendors
                  </TableHead>
                  {user?.canManageUsers && (
                    <TableHead className="text-gray-700 dark:text-gray-300">
                      Actions
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers?.map((u: User) => (
                  <TableRow
                    key={u._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                      {u.name}
                    </TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">
                      {u.email}
                    </TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">
                      {u.phone}
                    </TableCell>
                    <TableCell>
                      {u?.canManageUsers ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Ban className="h-4 w-4" />
                      )}
                    </TableCell>
                    <TableCell>
                      {u?.canManageVendors ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Ban className="h-4 w-4" />
                      )}
                    </TableCell>
                    {user?.canManageUsers && (
                      <TableCell>
                        <DeleteUser _id={u._id} />
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

export default UserTable;
