"use client";

import * as React from "react";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { taxAmtHelper } from "@/lib/helper";
import { CurrentLabour, Labour } from "@/lib/definitions";
import LabourSearch from "../LabourSearch";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  labour: Labour[] | null;
  currentLabours: CurrentLabour[] | null;
  setCurrentLabour: any;
  setIsEdited: any;
}

export function CurrentLabourDataTable<TData, TValue>({
  columns,
  data,
  labour,
  currentLabours,
  setCurrentLabour,
  setIsEdited,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [isAddingParts, setIsAddingParts] = React.useState(false);

  const deleteRow = (row: any) => {
    let arrayFirstHalf = currentLabours!.slice(0, row.index);
    let arraySecondHalf = currentLabours!.slice(row.index + 1);

    setCurrentLabour([...arrayFirstHalf, ...arraySecondHalf]);
    setIsEdited(true);
  };

  const handleQuantityUpdate = (row: any, toUpdate: number) => {
    let arrayFirstHalf = currentLabours!.slice(0, row.index);
    let arraySecondHalf = currentLabours!.slice(row.index + 1);

    const labourCode = row.getValue("labourCode");
    const prevQty = row.getValue("quantity");

    if (prevQty == 1 && toUpdate < 0) {
      return deleteRow(row);
    }

    const toUpdateQty = currentLabours?.find(
      (labour) => labour.labourCode == labourCode
    );
    if (toUpdateQty) {
      toUpdateQty!.quantity = prevQty + toUpdate;

      let newTaxAmt = taxAmtHelper(
        toUpdateQty.mrp,
        toUpdateQty.quantity,
        toUpdateQty.gst,
        "value"
      );

      toUpdateQty.amount = Number(newTaxAmt);

      setCurrentLabour([...arrayFirstHalf, toUpdateQty, ...arraySecondHalf]);
      setIsEdited(true);
    } else {
      console.log("Some Error has Occured");
    }
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div>
      <div className="rounded-md border">
        <div className="font-semibold text-lg p-5">Labour</div>
        <Table className="border-b">
          <TableHeader className="bg-gray-100 w-full">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  if (header.id != "quantity") {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  }
                })}
                <TableHead key={"handleQuantity"}>Quantity</TableHead>
                <TableHead key={"AMOUNT"}>Amount</TableHead>
                <TableHead key={"DELETE"}> </TableHead>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => {
                    if (cell.column.id != "quantity") {
                      return (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    }
                  })}
                  <TableCell key={"handleQuantity"} className="space-x-2">
                    <div className="flex flex-row justify-evenly w-full items-center space-x-5">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityUpdate(row, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <div>{row.getValue("quantity")}</div>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityUpdate(row, -1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell key={"AMOUNT"}>
                    {taxAmtHelper(
                      row.getValue("mrp"),
                      row.getValue("quantity"),
                      row.getValue("gst")
                    )}
                  </TableCell>

                  <TableCell key={"DELETE"}>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => deleteRow(row)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <></>
            )}
          </TableBody>
        </Table>
        <div className="p-2">
          {isAddingParts ? (
            <div className="flex px-3 space-x-3">
              <LabourSearch
                items={labour}
                setCurrentLabour={setCurrentLabour}
                currentLabours={currentLabours}
                setIsEdited={setIsEdited}
              />
              <Button
                variant="link"
                onClick={() => setIsAddingParts((prev) => false)}
              >
                <X />
              </Button>
            </div>
          ) : (
            <Button
              variant="link"
              onClick={() => setIsAddingParts((prev) => true)}
            >
              <div className="flex flex-row space-x-3 text-red-500 items-center">
                <div>+ Add Parts</div>
              </div>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
