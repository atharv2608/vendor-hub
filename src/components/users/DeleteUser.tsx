"use client"
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
const deleteUser = async (_id: string) => {
  const response = await axios.delete<ApiResponse>("/api/users/delete", {
    data: { _id },
  });
  return response.data;
};

export function DeleteUser({ _id }: { _id: string }) {
    const { data: session } = useSession();
    const user: User = session?.user as User;
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: deleteUser,
    onSuccess: (data) => {
      if (data?.success) {
        queryClient.invalidateQueries({ queryKey: ["users"] });
        toast({
          title: "Success",
          description: data?.message,
          variant: "success",
        });
        setOpen(false);
      }
    },
    onError: (error: AxiosError<ApiResponse>) => {
      const errorMessage =
        error.response?.data.message || "Error while deleting";
      toast({
        title: "Failed to delete user",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={() => setOpen((prev) => !prev)}>
      <DialogTrigger asChild>
        <Button className=" shadow-md bg-red-500 dark:text-white dark:hover:bg-indigo-400 dark:hover:text-white"
            disabled={user._id == _id}
        >
          <Trash className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete user</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete user?
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-5 justify-end">
          <Button
            className="bg-red-500 text-white hover:bg-red-500 hover:text-white"
            onClick={() => mutate(_id)}
            disabled={isPending}
          >
            Delete
          </Button>

          <Button onClick={() => setOpen(false)}> Cancel</Button>
        </div>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
