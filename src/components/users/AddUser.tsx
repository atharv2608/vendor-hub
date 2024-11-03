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
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userSchema } from "@/schemas/userSchema";
import { Switch } from "../ui/switch";

type FormValues = z.infer<typeof userSchema>;

const addUser = async (data: FormValues) => {
  const response = await axios.post<ApiResponse>("/api/users/add", data);
  return response.data;
};

export function AddUser() {
  const form = useForm<FormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      canManageUsers: false,
      canManageVendors: false,
    },
  });
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: addUser,
    onSuccess: (data) => {
      if (data?.success) {
        queryClient.invalidateQueries({ queryKey: ["users"] });
        toast({
          title: "Success",
          description: data?.message,
          variant: "success",
        });

        form.reset();
        setOpen(false);
      }
    },
    onError: (error: AxiosError<ApiResponse>) => {
      const errorMessage = error.response?.data.message || "Error while adding";
      toast({
        title: "Failed to add user",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (data: FormValues) => {
    mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={() => setOpen((prev) => !prev)}>
      <DialogTrigger asChild>
        <Button className="shadow-md dark:bg-indigo-500 dark:text-white dark:hover:bg-indigo-400 dark:hover:text-white">
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2" // Use grid layout with two columns on larger screens
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-white">
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter name"
                      {...field}
                      className="bg-gray-100 text-gray-800"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-white">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter email"
                      {...field}
                      className="bg-gray-100 text-gray-800"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-white">
                    Phone
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter phone number"
                      {...field}
                      className="bg-gray-100 text-gray-800"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-white">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      {...field}
                      className="bg-gray-100 text-gray-800"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-white">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter password again"
                      {...field}
                      className="bg-gray-100 text-gray-800"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="canManageUsers"
              render={({ field }) => (
                <div className="flex items-center space-x-4">
                  <FormItem>
                    <FormLabel>Manage Users</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className={` ${
                          field.value
                            ? "bg-indigo-600 "
                            : "bg-gray-600 border-gray-500"
                        }`}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 dark:text-red-500" />
                  </FormItem>

                  <FormField
                    control={form.control}
                    name="canManageVendors"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Manage Vendors</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className={` ${
                              field.value
                                ? "bg-indigo-600 "
                                : "bg-gray-600 border-gray-500"
                            }`}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 dark:text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            />
            <div className="col-span-full">
              <Button
                className="shadow-md dark:bg-indigo-500 dark:text-white dark:hover:bg-indigo-400 dark:hover:text-white w-full"
                disabled={isPending}
              >
                Add
              </Button>
            </div>
          </form>
        </Form>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
