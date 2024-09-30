"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getButtonText, jobCardStatusKey } from "../lib/helper";
import {
  JobCard,
  Part,
  CurrentPart,
  CurrentLabour,
} from "@/app/lib/definitions";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { getCookie } from "cookies-next";

export const jobCardColumns: ColumnDef<JobCard>[] = [
  {
    accessorKey: "carNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Car Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "customerName",
    header: "Customer Name",
  },
  {
    accessorKey: "$createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("$createdAt"));
      return <div>{date.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "jobCardStatus",
    header: "Status",
    cell: ({ row }) => {
      const statusObj = jobCardStatusKey.find(
        (status: any) => status.code === row.getValue("jobCardStatus")
      );
      const statusString = statusObj ? statusObj.description : "Unknown Status";

      return <div>{statusString}</div>;
    },
    filterFn: (row, columnId, filterValue) => {
      return row.getValue(columnId) == filterValue;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const pathname = usePathname();

      const jobCard = row.original;

      const token = getCookie("user");

      const parsedToken = JSON.parse(String(token));

      const userAccess = parsedToken.labels[0];

      // console.log("Role is - ", userAccess);

      let checkForStatus;

      switch (userAccess) {
        case "parts":
          checkForStatus = 0;
          break;
        case "biller":
          checkForStatus = 1;
          break;

        default:
          break;
      }

      const isAdding = jobCard.jobCardStatus == checkForStatus;
      const forPartsManager = jobCard.sendToPartsManager;

      return (
        <div className="flex justify-center items-center">
          <Link
            href={`${pathname}/jobCard/${jobCard.$id}`}
            className={`flex justify-center items-center rounded-md w-fit px-3 py-2 border border-gray-200 ${
              userAccess == "parts"
                ? `${
                    isAdding && forPartsManager
                      ? `bg-red-500 text-white hover:bg-red-400`
                      : `bg-white text-gray-700 hover:bg-gray-200`
                  }`
                : `${
                    isAdding
                      ? `bg-red-500 text-white hover:bg-red-400`
                      : `bg-white text-gray-700 hover:bg-gray-200`
                  }`
            }}`}
          >
            {getButtonText(userAccess, isAdding, forPartsManager)}
          </Link>
        </div>
      );
    },
  },
];

export const partColumns: ColumnDef<Part>[] = [
  {
    accessorKey: "partName",
    header: "Part Name",
  },
  {
    accessorKey: "partNumber",
    header: "Part Number",
  },
  {
    accessorKey: "hsn",
    header: "HSN",
  },
  {
    accessorKey: "mrp",
    header: "MRP",
    cell: ({ row }) => {
      const price: number = row.getValue("mrp");
      return <div>&#8377;{price}</div>;
    },
  },
  {
    accessorKey: "gst",
    header: "GST",
    cell: ({ row }) => {
      const gst: number = row.getValue("gst");
      return <div>{gst}%</div>;
    },
  },

  //   {
  //     accessorKey: "quantity",
  //     header: "Quantity",
  //     // cell: ({ row }) => {
  //     //   return <div>HELLOOO</div>;
  //     // },
  //   },
  // {
  //   header: "Amount",
  //   cell: ({ row }) => {
  //     const gst: number = row.getValue("gst");
  //     const price: number = row.getValue("mrp");
  //     const quantity: number = row.getValue("quantity");

  //     let amtPreGst = price * quantity;
  //     let amtPostGst = amtPreGst * (1 + gst / 100);
  //     amtPostGst = Math.round(amtPostGst * 100) / 100;

  //     return <div>&#8377;{amtPostGst}</div>;
  //   },
  // },
];

export const currentPartsColumns: ColumnDef<CurrentPart>[] = [
  {
    accessorKey: "partName",
    header: "Part Name",
  },
  {
    accessorKey: "partNumber",
    header: "Part Number",
  },
  {
    accessorKey: "mrp",
    header: "MRP",
    cell: ({ row }) => {
      const price: number = row.getValue("mrp");
      return <div>&#8377;{price}</div>;
    },
  },
  {
    accessorKey: "gst",
    header: "GST",
    cell: ({ row }) => {
      const gst: number = row.getValue("gst");
      return <div>{gst}%</div>;
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    // cell: ({ row }) => {
    //   return <div>HELLOOO</div>;
    // },
  },
  // {
  //   header: "Amount",
  //   cell: ({ row }) => {
  //     const gst: number = row.getValue("gst");
  //     const price: number = row.getValue("mrp");
  //     const quantity: number = row.getValue("quantity");

  //     let amtPreGst = price * quantity;
  //     let amtPostGst = amtPreGst * (1 + gst / 100);
  //     amtPostGst = Math.round(amtPostGst * 100) / 100;

  //     return <div>&#8377;{amtPostGst}</div>;
  //   },
  // },
];

export const currentLabourColumns: ColumnDef<CurrentLabour>[] = [
  {
    accessorKey: "labourName",
    header: "Labour Name",
  },
  {
    accessorKey: "labourCode",
    header: "Labour Code",
  },
  {
    accessorKey: "mrp",
    header: "MRP",
    cell: ({ row }) => {
      const price: number = row.getValue("mrp");
      return <div>&#8377;{price}</div>;
    },
  },
  {
    accessorKey: "gst",
    header: "GST",
    cell: ({ row }) => {
      const gst: number = row.getValue("gst");
      return <div>{gst}%</div>;
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    // cell: ({ row }) => {
    //   return <div>HELLOOO</div>;
    // },
  },
  // {
  //   header: "Amount",
  //   cell: ({ row }) => {
  //     const gst: number = row.getValue("gst");
  //     const price: number = row.getValue("mrp");
  //     const quantity: number = row.getValue("quantity");

  //     let amtPreGst = price * quantity;
  //     let amtPostGst = amtPreGst * (1 + gst / 100);
  //     amtPostGst = Math.round(amtPostGst * 100) / 100;

  //     return <div>&#8377;{amtPostGst}</div>;
  //   },
  // },
];
