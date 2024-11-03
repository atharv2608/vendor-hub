import React from "react";
import { Button } from "../ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchVendors } from "./VendorTable";

function DownloadReport() {
  const { data, isPending } = useQuery({
    queryKey: ["vendorsQueryKey"],
    queryFn: fetchVendors,
  });

  const downloadCSV = () => {
    if (!data) return;

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
      ...data.map((vendor) => [
        vendor._id,
        vendor.name,
        vendor.contact,
        vendor.type,
        vendor.criticality,
        vendor.accountStatus,
        vendor.serviceProvided,
      ]), // Map your data fields accordingly
    ]
      .map((row) => row.join(","))
      .join("\n");

    // Create a Blob from the CSV string
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "vendors_data.csv"; // Provide a default filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      onClick={downloadCSV}
      disabled={isPending}
      className="dark:bg-indigo-500  dark:text-white dark:hover:bg-indigo-400 dark:hover:text-white"
    >
      Export
    </Button>
  );
}

export default DownloadReport;
