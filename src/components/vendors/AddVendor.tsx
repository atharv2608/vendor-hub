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
import { addVendorSchema } from "@/schemas/vendorSchema";
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
type FormValues = z.infer<typeof addVendorSchema>;
const addVendor = async (data: FormValues) => {
  const response = await axios.post<ApiResponse>("/api/vendor/add", data);
  return response.data;
};
export function AddVendor() {
  const form = useForm<FormValues>({
    resolver: zodResolver(addVendorSchema),
    defaultValues: {
      name: "",
      contact: "",
      serviceProvided: "",
    },
  });
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  
  const { mutate, isPending } = useMutation({
    mutationFn: addVendor,
    onSuccess: (data) => {
      if (data?.success) {
        queryClient.invalidateQueries({ queryKey: ["vendorsQueryKey"] });
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
        title: "Failed to add vendor",
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
        <Button className=" shadow-md dark:bg-indigo-500 dark:text-white dark:hover:bg-indigo-400 dark:hover:text-white">
          Add Vendor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Vendor</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-5"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-white">
                    Vendor Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter vendor name"
                      {...field}
                      className="bg-gray-100  text-gray-800"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-white">
                    Contact
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter vendor email"
                      {...field}
                      className="bg-gray-100  text-gray-800 "
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vendor Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white text-black">
                        <SelectValue placeholder="Select vendor type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["supplier", "logistics", "service provider"].map(
                        (type) => (
                          <SelectItem value={type} key={type}>
                            {type}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500 dark:text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="serviceProvided"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-white">
                    Service Provided
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter service"
                      {...field}
                      className="bg-gray-100  text-gray-800"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="criticality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Criticality</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white text-black">
                        <SelectValue placeholder="Select criticality status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["low", "medium", "high", "critical"].map(
                        (criticality) => (
                          <SelectItem value={criticality} key={criticality}>
                            {criticality}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500 dark:text-red-500" />
                </FormItem>
              )}
            />

            <Button
              className=" shadow-md dark:bg-indigo-500 dark:text-white dark:hover:bg-indigo-400 dark:hover:text-white w-full"
              disabled={isPending}
            >
              Add
            </Button>
          </form>
        </Form>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
