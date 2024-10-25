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
import {
  getUserAccess,
  removeTempLabourObjDiscount,
  splitInsuranceAmt,
  taxAmtHelper,
  updateTempLabourObjDiscount,
  updateTempLabourObjQuantity,
} from "@/lib/helper";
import { CurrentLabour, Labour, UserType } from "@/lib/definitions";
import LabourSearch from "../LabourSearch";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "../ui/input";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  labour: Labour[] | null;
  currentLabours: CurrentLabour[] | null;
  setCurrentLabour: any;
  setIsEdited: any;
  user: UserType;
  currentJobCardStatus?: number;
  isInsuranceDetails: boolean;
}

export function CurrentLabourDataTable<TData, TValue>({
  columns,
  data,
  labour,
  currentLabours,
  setCurrentLabour,
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

  useEffect(() => {
    let foundIndexDisc = currentLabours?.findIndex(
      (work) => work.discountPercentage && work.discountPercentage != 0
    );
    console.log("FOUND INDEX", foundIndexDisc);
    setIsAlreadyDiscount(foundIndexDisc != -1);

    let foundIndexInsurance = currentLabours?.findIndex(
      (work) => work.insurancePercentage && work.insurancePercentage != 0
    );
    console.log("FOUND INDEX", foundIndexInsurance);
    setIsAlreadyInsurance(foundIndexInsurance != -1);
  }, []);

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

    let updatedObj;

    if (toUpdateQty) {
      if (toUpdate > 0) {
        updatedObj = updateTempLabourObjQuantity(toUpdateQty, 1);
      } else {
        updatedObj = updateTempLabourObjQuantity(toUpdateQty, -1);
      }

      setCurrentLabour([...arrayFirstHalf, updatedObj, ...arraySecondHalf]);
      setIsEdited(true);
    } else {
      console.log("Some Error has Occured");
    }
  };

  const handleAllDiscount = (discount: number) => {
    if (currentLabours) {
      if (Number(discount) > 15) {
        toast("Discount More than 15% is not allowed");
      } else {
        let newArr: CurrentLabour[] = [];
        currentLabours?.map((part: CurrentLabour) => {
          const updatedPartObj = updateTempLabourObjDiscount(part, discount);
          console.log("UPDATED OBJ - ", updatedPartObj);
          newArr.push(updatedPartObj!);
        });
        setCurrentLabour([...newArr!]);
        setIsEdited(true);
      }
    }
  };

  const removeAllDiscount = () => {
    let newArr: CurrentLabour[] = [];
    currentLabours?.map((part: CurrentLabour) => {
      const updatedPartObj = removeTempLabourObjDiscount(part);
      newArr.push(updatedPartObj!);
    });
    setCurrentLabour([...newArr!]);
    setIsDiscount(false);
    // setIsEdited(true);
  };

  const handleDiscount = (row: any, discount: number) => {
    if (Number(discount) > 15) {
      toast("Discount More than 15% is not allowed");
    } else {
      let arrayFirstHalf = currentLabours!.slice(0, row.index);
      let arraySecondHalf = currentLabours!.slice(row.index + 1);

      const labourCode = row.getValue("labourCode");

      const toUpdateDisc = currentLabours?.find(
        (work) => work.labourCode == labourCode
      );

      let updatedObj;

      if (toUpdateDisc) {
        updatedObj = updateTempLabourObjDiscount(toUpdateDisc, discount);
        setCurrentLabour([...arrayFirstHalf, updatedObj, ...arraySecondHalf]);
        setIsEdited(true);
      }
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
      <div className="rounded-md border">
        <div className="flex flex-row justify-between items-center">
          <div className="font-semibold text-lg p-5">Labour</div>
          {getUserAccess(user) == "biller" && (
            <div className="flex flex-row space-x-5 mr-5 items-center">
              {currentJobCardStatus == 2 && (
                <>
                  {isDiscount ? (
                    <div className="flex justify-around w-fit items-center space-x-3">
                      <Input
                        placeholder="Discount on All Parts"
                        type="number"
                        onChange={(event) =>
                          handleAllDiscount(Number(event.target.value))
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
                        // onChange={(event) =>
                        //   handleAllInsurance(event.target.value)
                        // }
                        className="max-w-sm"
                      />
                      {/* <X onClick={removeAllInsurance} /> */}
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
                    header.id != "amount" &&
                    header.id != "discountPercentage" &&
                    header.id != "insurancePercentage"
                  ) {
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
                      cell.column.id != "insurancePercentage" &&
                      cell.column.id != "amount" &&
                      cell.column.id != "discountPercentage"
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
                        value={row.getValue("discountPercentage") || 0}
                        onChange={(event) =>
                          handleDiscount(row, Number(event.target.value))
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
                      <>{row.getValue("amount")}</>
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
                        // onChange={(event) =>
                        //   // handleDiscount(row, event.target.value)
                        //   handleInsurance(row, event.target.value)
                        // }
                        className="w-10"
                      />
                    </TableCell>
                  )}

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
