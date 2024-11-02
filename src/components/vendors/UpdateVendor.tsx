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
import { updateVendorSchema } from "@/schemas/vendorSchema";
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
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AccountStatus, CriticalityStatus } from "@/types";
type FormValues = z.infer<typeof updateVendorSchema>;

type UpdateProps = {
  _id: string;
  contact: string;
  accountStatus: AccountStatus;
  criticality: CriticalityStatus;
};

const updateVendor = async (data: FormValues) => {
  const response = await axios.put<ApiResponse>("/api/vendor/update", data);
  return response.data;
};
export function UpdateVendor({
  _id,
  contact,
  accountStatus,
  criticality,
}: UpdateProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(updateVendorSchema),
    defaultValues: {
      _id: _id,
      contact: contact,
      accountStatus: accountStatus,
      criticality: criticality,
    },
  });
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const {reset} = form;
  const { mutate, isPending } = useMutation({
    mutationFn: updateVendor,
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
      const errorMessage =
        error.response?.data.message || "Error while updating";
      toast({
        title: "Failed to update vendor",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
  const handleSubmit = async (data: FormValues) => {
    mutate(data);
  };

  useEffect(() => {
    if (open) {
      reset({ _id, contact, accountStatus, criticality });
    }
  }, [open, _id, contact, accountStatus, criticality, reset]);
  return (
    <Dialog open={open} onOpenChange={() => setOpen((prev) => !prev)}>
      <DialogTrigger asChild>
        <Button className=" shadow-md dark:bg-indigo-500 dark:text-white dark:hover:bg-indigo-400 dark:hover:text-white">
          Update
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
              name="_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-white">
                    Vendor Id
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled
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
                        <SelectValue placeholder="Update criticality status" />
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
            <FormField
              control={form.control}
              name="accountStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white text-black">
                        <SelectValue placeholder="Update account status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(AccountStatus).map((criticality) => (
                        <SelectItem value={criticality} key={criticality}>
                          {criticality}
                        </SelectItem>
                      ))}
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
              Update
            </Button>
          </form>
        </Form>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
