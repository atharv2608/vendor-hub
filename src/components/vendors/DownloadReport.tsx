"use client"
import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectGroup,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { fetchVendors } from "./VendorTable";

function DownloadReport() {
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [criticality, setCriticality] = useState("all");
  
  const { data, isPending } = useQuery({
    queryKey: ["vendorsQueryKey"],
    queryFn: fetchVendors
  });
  const downloadCSV = () => {
    
    if (!data) return;
    const filteredVendors = data.filter((vendor) => {
      const typeMatches = type === "all" || vendor.type === type;
      const statusMatches = status === "all" || vendor.accountStatus === status;
      const criticalityMatches = criticality === "all" || vendor.criticality === criticality;
      return typeMatches && statusMatches && criticalityMatches;
    });
  
    const csvString = [
      [
        "Id",
        "Name",
        "Contact",
        "Type",
        "Criticality",
        "Status",
        "Service Provided",
      ],
      ...filteredVendors.map((vendor) => [
        vendor._id,
        vendor.name,
        vendor.contact,
        vendor.type,
        vendor.criticality,
        vendor.accountStatus,
        vendor.serviceProvided,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "vendors_data.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-4 ">
        <Select onValueChange={(value) => setType(value)}>
          <SelectTrigger className="dark:border-white border-black">
            <SelectValue placeholder="Vendor Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Type</SelectLabel>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="logistics">Logistics</SelectItem>
              <SelectItem value="supplier">Supplier</SelectItem>
              <SelectItem value="service provider">Service provider</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => setStatus(value)}>
          <SelectTrigger className="dark:border-white border-black">
            <SelectValue placeholder="Account Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Status</SelectLabel>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => setCriticality(value)}>
          <SelectTrigger className="dark:border-white border-black">
            <SelectValue placeholder="Criticality" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Status</SelectLabel>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={downloadCSV}
        disabled={isPending}
        className="dark:bg-indigo-500 dark:text-white dark:hover:bg-indigo-400 dark:hover:text-white"
      >
        Export
      </Button>
    </div>
  );
}

export default DownloadReport;
