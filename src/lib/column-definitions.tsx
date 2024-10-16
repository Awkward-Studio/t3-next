"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Divide } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getButtonText, jobCardStatusKey } from "../lib/helper";

import {
  JobCard,
  Part,
  CurrentPart,
  CurrentLabour,
  Labour,
  TempCar,
} from "@/lib/definitions";
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

      switch (userAccess) {
        case "parts":
          return (
            <div className="flex justify-center items-center">
              <Link
                href={`${pathname}/jobCard/${jobCard.$id}`}
                className={`flex justify-center items-center rounded-md w-fit px-3 py-2 border border-gray-200 ${
                  jobCard.jobCardStatus == 0 && jobCard.sendToPartsManager
                    ? "bg-red-500 text-white hover:bg-red-400"
                    : "bg-white text-gray-700 hover:bg-gray-200"
                }`}
              >
                {jobCard.jobCardStatus == 0 && jobCard.sendToPartsManager
                  ? "Add"
                  : "Edit"}
              </Link>
            </div>
          );

        case "biller":
          return (
            <div className="flex justify-center items-center">
              <Link
                href={`${pathname}/jobCard/${jobCard.$id}`}
                className={`flex justify-center items-center rounded-md w-fit px-3 py-2 border border-gray-200 ${
                  jobCard.jobCardStatus == 1
                    ? "bg-red-500 text-white hover:bg-red-400"
                    : "bg-white text-gray-700 hover:bg-gray-200"
                }`}
              >
                {jobCard.jobCardStatus == 1 ? "Add" : "Edit"}
              </Link>
            </div>
          );

        case "security":
          return <></>;
        case "service":
          return (
            <div className="flex justify-center items-center">
              <Link
                href={`${pathname}/createJobCard/${jobCard.$id}`}
                className={`flex justify-center items-center rounded-md w-fit px-3 py-2 border border-gray-200 bg-white text-gray-700 hover:bg-gray-200`}
              >
                {"View"}
              </Link>
            </div>
          );

        default:
          break;
      }
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
  {
    accessorKey: "quantity",
  },
  {
    accessorKey: "discount",
  },
  {
    accessorKey: "insurance",
  },
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
  },
];

export const labourColumns: ColumnDef<Labour>[] = [
  {
    accessorKey: "labourName",
    header: "Labour Name",
  },
  {
    accessorKey: "labourCode",
    header: "Labour Code",
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
];

export const tempCarsColumns: ColumnDef<TempCar>[] = [
  {
    accessorKey: "carNumber",
    header: "Car Number",
  },
  {
    accessorKey: "carMake",
    header: "Car Make",
    cell: ({ row }) => {
      const tempCar = row.original;

      return (
        <div className="flex flex-col items-start">
          <div>{tempCar.carMake}</div>
          <div>{tempCar.carModel}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "purposeOfVisit",
    header: "POV",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const pathname = usePathname();

      const tempCar = row.original;

      const token = getCookie("user");

      const parsedToken = JSON.parse(String(token));

      const userAccess = parsedToken.labels[0];

      let currentCounter = getCookie("currentCounter");

      switch (userAccess) {
        case "security":
          return <></>;
        case "service":
          return (
            <div className="flex justify-center items-center">
              <Link
                href={`${
                  tempCar.carStatus == 0
                    ? `${pathname}/createJobCard/${tempCar.$id}?currentCounter=${currentCounter}`
                    : `${pathname}/viewJobCard/${tempCar.jobCardId}`
                }`}
                className={`flex justify-center items-center rounded-md w-fit px-3 py-2 border border-gray-200 ${
                  tempCar.carStatus == 0
                    ? "bg-red-500 text-white hover:bg-red-400"
                    : "bg-white text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tempCar.carStatus == 0 ? "Create" : "View"}
              </Link>
            </div>
          );

        default:
          break;
      }
    },
  },
];
