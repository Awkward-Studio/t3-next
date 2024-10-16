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
import { Minus, Percent, Plus, Shield, Trash2, X } from "lucide-react";
import PartsSearch from "@/components/PartsSearch";
import { getUserAccess, splitInsuranceAmt, taxAmtHelper } from "@/lib/helper";
import { CurrentPart, Part, UserType } from "@/lib/definitions";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  parts: Part[] | null;
  currentParts: CurrentPart[] | null;
  setCurrentParts: any;
  setIsEdited: any;
  user: UserType;
  currentJobCardStatus?: number;
  isInsuranceDetails: boolean;
}

export function CurrentPartsDataTable<TData, TValue>({
  columns,
  data,
  parts,
  currentParts,
  setCurrentParts,
  setIsEdited,
  user,
  currentJobCardStatus,
  isInsuranceDetails,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isAddingParts, setIsAddingParts] = useState(false);

  const [isDiscount, setIsDiscount] = useState(false);
  const [isAlreadyDiscount, setIsAlreadyDiscount] = useState(false);
  const [isInsurance, setIsInsurance] = useState(false);
  const [isAlreadyInsurance, setIsAlreadyInsurance] = useState(false);

  // console.log("THIS IS THE CURRENT JOBCARD STATUS - ", currentJobCardStatus);

  useEffect(() => {
    let foundIndexDisc = currentParts?.findIndex(
      (part) => part.discount && part.discount != 0
    );
    console.log("FOUND INDEX", foundIndexDisc);
    setIsAlreadyDiscount(foundIndexDisc != -1);

    let foundIndexInsurance = currentParts?.findIndex(
      (part) => part.insurance && part.insurance != 0
    );
    console.log("FOUND INDEX", foundIndexInsurance);
    setIsAlreadyInsurance(foundIndexInsurance != -1);
  }, []);

  const deleteRow = (row: any) => {
    let arrayFirstHalf = currentParts!.slice(0, row.index);
    let arraySecondHalf = currentParts!.slice(row.index + 1);

    setCurrentParts([...arrayFirstHalf, ...arraySecondHalf]);
    setIsEdited(true);
  };

  const handleQuantityUpdate = (row: any, toUpdate: number) => {
    let arrayFirstHalf = currentParts!.slice(0, row.index);
    let arraySecondHalf = currentParts!.slice(row.index + 1);

    const partNumber = row.getValue("partNumber");
    const prevQty = row.getValue("quantity");

    if (prevQty == 1 && toUpdate < 0) {
      return deleteRow(row);
    }

    const toUpdateQty = currentParts?.find(
      (part) => part.partNumber == partNumber
    );
    if (toUpdateQty) {
      toUpdateQty.quantity = prevQty + toUpdate;

      let newTaxAmt = taxAmtHelper(
        toUpdateQty.mrp,
        toUpdateQty.quantity,
        toUpdateQty.gst,
        toUpdateQty.discount,
        "value"
      );

      toUpdateQty.amount = Number(newTaxAmt);

      setCurrentParts([...arrayFirstHalf, toUpdateQty, ...arraySecondHalf]);
      setIsEdited(true);
    } else {
      console.log("Some Error has Occured");
    }
  };

  const handleAllDiscount = (discount: string) => {
    if (Number(discount) > 15) {
      toast("Discount More than 15% is not allowed");
    } else {
      let tempObj = currentParts;
      console.log("ALL DISCOUNT - ", discount);
      tempObj!.map((part) => {
        part.discount = Number(discount);
        let newTaxAmt = taxAmtHelper(
          part.mrp,
          part.quantity,
          part.gst,
          Number(discount),
          "value"
        );

        part.amount = Number(newTaxAmt);
      });
      setCurrentParts([...tempObj!]);
      setIsEdited(true);
    }
  };

  const removeAllDiscount = () => {
    let tempObj = currentParts;

    tempObj!.map((part) => {
      part.discount = undefined;
    });
    setCurrentParts([...tempObj!]);
    setIsDiscount(false);
    // setIsEdited(true);
  };

  const handleDiscount = (row: any, discount: string) => {
    if (Number(discount) > 15) {
      toast("Discount More than 15% is not allowed");
    } else {
      let arrayFirstHalf = currentParts!.slice(0, row.index);
      let arraySecondHalf = currentParts!.slice(row.index + 1);

      const partNumber = row.getValue("partNumber");

      const toUpdateDisc = currentParts?.find(
        (part) => part.partNumber == partNumber
      );

      if (toUpdateDisc) {
        toUpdateDisc.discount = Number(discount);

        let newTaxAmt = taxAmtHelper(
          toUpdateDisc.mrp,
          toUpdateDisc.quantity,
          toUpdateDisc.gst,
          Number(discount),
          "value"
        );

        toUpdateDisc.amount = Number(newTaxAmt);
        setCurrentParts([...arrayFirstHalf, toUpdateDisc, ...arraySecondHalf]);
        setIsEdited(true);
      }
    }
  };

  const handleAllInsurance = (insurance: string) => {
    let tempObj = currentParts;
    console.log("ALL insurance - ", insurance);
    tempObj!.map((part) => {
      part.insurance = Number(insurance);
      // console.log(splitInsuranceAmt(part.amount, Number(insurance)));
      let splitAmts = splitInsuranceAmt(
        Number(
          taxAmtHelper(
            part.mrp,
            part.quantity,
            part.gst,
            part.discount,
            "value"
          )
        ),
        Number(insurance)
      );
      part.customerAmt = splitAmts.customerAmt;
      part.insuranceAmt = splitAmts.insuranceAmt;
    });
    setCurrentParts([...tempObj!]);
    // setIsEdited(true);
  };

  const removeAllInsurance = () => {
    let tempObj = currentParts;

    tempObj!.map((part) => {
      part.insurance = undefined;
      part.customerAmt = undefined;
      part.insuranceAmt = undefined;
    });
    setCurrentParts([...tempObj!]);
    setIsInsurance(false);
    // setIsEdited(true);
  };

  const handleInsurance = (row: any, insurance: string) => {
    let arrayFirstHalf = currentParts!.slice(0, row.index);
    let arraySecondHalf = currentParts!.slice(row.index + 1);

    const partNumber = row.getValue("partNumber");

    const toUpdateInsurance = currentParts?.find(
      (part) => part.partNumber == partNumber
    );

    if (toUpdateInsurance) {
      toUpdateInsurance.insurance = Number(insurance);

      let newTaxAmt = taxAmtHelper(
        toUpdateInsurance.mrp,
        toUpdateInsurance.quantity,
        toUpdateInsurance.gst,
        toUpdateInsurance.discount,
        "value"
      );

      let splitAmts = splitInsuranceAmt(Number(newTaxAmt), Number(insurance));

      toUpdateInsurance.customerAmt = splitAmts.customerAmt;
      toUpdateInsurance.insuranceAmt = splitAmts.insuranceAmt;

      toUpdateInsurance.amount = Number(newTaxAmt);
      setCurrentParts([
        ...arrayFirstHalf,
        toUpdateInsurance,
        ...arraySecondHalf,
      ]);
      setIsEdited(true);
    }
  };

  const getAmountSplit = (amount: number, insurance: string) => {
    let splitAmts = splitInsuranceAmt(amount, Number(insurance));

    return (
      <div className="flex flex-col space-y-4">
        <div className="text-blue-500">
          <span className="font-bold"> I : </span>
          {Math.round(splitAmts.insuranceAmt * 100) / 100}
        </div>
        <div className="text-red-500">
          <span className="font-bold"> C : </span>
          {Math.round(splitAmts.customerAmt * 100) / 100}
        </div>{" "}
      </div>
    );
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
      <div className="flex flex-col rounded-md border">
        <div className="flex flex-row justify-between items-center">
          <div className="font-semibold text-lg p-5">Parts</div>
          {getUserAccess(user) == "biller" && (
            <div className="flex flex-row space-x-5 mr-5 items-center">
              {currentJobCardStatus == 2 && (
                <>
                  {isDiscount ? (
                    <div className="flex justify-around w-fit items-center space-x-3">
                      <Input
                        placeholder="Discount on All Parts"
                        type="number"
                        // value={
                        //   (table
                        //     .getColumn("carNumber")
                        //     ?.getFilterValue() as string) ?? ""
                        // }
                        onChange={(event) =>
                          handleAllDiscount(event.target.value)
                        }
                        className="max-w-sm"
                      />
                      <X onClick={removeAllDiscount} />
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      className="border border-red-500 text-red-500"
                      onClick={() => setIsDiscount((prev) => true)}
                    >
                      <Percent />
                    </Button>
                  )}
                </>
              )}

              {currentJobCardStatus == 3 && (
                <>
                  {isInsurance ? (
                    <div className="flex justify-around w-fit items-center space-x-3">
                      <Input
                        placeholder="Insurance on All Parts"
                        type="number"
                        // value={
                        //   (table
                        //     .getColumn("carNumber")
                        //     ?.getFilterValue() as string) ?? ""
                        // }
                        onChange={(event) =>
                          handleAllInsurance(event.target.value)
                        }
                        className="max-w-sm"
                      />
                      <X onClick={removeAllInsurance} />
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      className="border border-red-500 text-red-500"
                      onClick={() => {
                        if (isInsuranceDetails) {
                          setIsInsurance((prev) => true);
                        } else {
                          toast("Add Insurance Details to Proceed");
                        }
                      }}
                    >
                      <Shield />
                    </Button>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        <Table className="border-b">
          <TableHeader className="bg-gray-100 w-full">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  if (
                    header.id != "quantity" &&
                    header.id != "discount" &&
                    header.id != "insurance"
                  ) {
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
                <TableHead key={"handleQuantity"} className="text-center">
                  Quantity
                </TableHead>
                {(isDiscount || isAlreadyDiscount) && (
                  <TableHead key={"DISCOUNT"} className="text-center">
                    Discount %
                  </TableHead>
                )}
                <TableHead key={"AMOUNT"}>Amount</TableHead>

                {(isInsurance || isAlreadyInsurance) && (
                  <TableHead key={"INSURANCE"} className="text-center">
                    Insurance %
                  </TableHead>
                )}
                {/* {isInsurance && (
                  <TableHead key={"INSURANCE_AMOUNT"} className="text-center">
                    Insurance Amt
                  </TableHead>
                )}
                {isInsurance && (
                  <TableHead key={"CUSTOMER_AMOUNT"} className="text-center">
                    Customer Amt
                  </TableHead>
                )} */}
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
                    if (
                      cell.column.id != "quantity" &&
                      cell.column.id != "discount" &&
                      cell.column.id != "insurance"
                    ) {
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
                    <div className="flex flex-row justify-evenly w-full items-center space-x-2">
                      <Button
                        variant="link"
                        size="icon"
                        onClick={() => handleQuantityUpdate(row, -1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <div>{row.getValue("quantity")}</div>
                      <Button
                        variant="link"
                        size="icon"
                        onClick={() => handleQuantityUpdate(row, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  {(isDiscount || isAlreadyDiscount) && (
                    <TableCell
                      key={"DISCOUNT"}
                      className="flex justify-center items-center h-full"
                    >
                      <Input
                        placeholder="%"
                        value={row.getValue("discount") || 0}
                        onChange={(event) =>
                          handleDiscount(row, event.target.value)
                        }
                        className="w-10"
                      />
                    </TableCell>
                  )}

                  <TableCell key={"AMOUNT"}>
                    {isInsurance || isAlreadyInsurance ? (
                      <>
                        {getAmountSplit(
                          Number(
                            taxAmtHelper(
                              row.getValue("mrp"),
                              row.getValue("quantity"),
                              row.getValue("gst"),
                              row.getValue("discount"),
                              "value"
                            )
                          ),
                          row.getValue("insurance")
                        )}
                      </>
                    ) : (
                      <>
                        {taxAmtHelper(
                          row.getValue("mrp"),
                          row.getValue("quantity"),
                          row.getValue("gst"),
                          row.getValue("discount")
                        )}
                      </>
                    )}
                  </TableCell>
                  {(isInsurance || isAlreadyInsurance) && (
                    <TableCell
                      key={"INSURANCE"}
                      className="flex justify-center items-center h-full w-fit"
                    >
                      <Input
                        placeholder="%"
                        value={row.getValue("insurance") || 0}
                        onChange={(event) =>
                          // handleDiscount(row, event.target.value)
                          handleInsurance(row, event.target.value)
                        }
                        className="w-10"
                      />
                    </TableCell>
                  )}

                  {/* {isInsurance && (
                    <TableCell
                      key={"INSURANCE_AMOUNT"}
                      className="flex justify-center items-center h-full"
                    >
                      HELLO
                    </TableCell>
                  )}

                  {isInsurance && (
                    <TableCell
                      key={"CUSTOMER_AMOUNT"}
                      className="flex justify-center items-center h-full"
                    >
                      HELLOO
                    </TableCell>
                  )} */}

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
              <PartsSearch
                items={parts}
                setCurrentParts={setCurrentParts}
                currentParts={currentParts}
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
