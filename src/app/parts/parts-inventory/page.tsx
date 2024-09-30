"use client";

import { getAllParts } from "@/app/lib/appwrite";
import React, { useEffect, useState } from "react";
import { Part } from "@/app/lib/definitions";
import { partColumns } from "@/app/lib/column-definitions";
import { PartsDataTable } from "@/components/data-tables/parts-data-table";
import InventoryPageSkeleton from "@/components/skeletons/InventoryPageSkeleton";

type Props = {};

export default function PartsInventory({}: Props) {
  const [parts, setParts] = useState<Part[]>([]);

  useEffect(() => {
    const getParts = async () => {
      const partsObj = await getAllParts();
      console.log("THESE ARE THE PARTS - ", partsObj);
      setParts((prev) => partsObj.documents);
    };

    getParts();
  }, []);

  return (
    <div className="flex flex-col w-[90%] mt-10">
      {!(parts.length > 0) ? (
        <InventoryPageSkeleton />
      ) : (
        <>
          <div>
            <div className="font-semibold text-3xl">Parts Inventory</div>
            <div className="font-medium">
              These are the parts currently in the inventory
            </div>
          </div>
          <div className="mt-8">
            {parts && <PartsDataTable columns={partColumns} data={parts} />}
          </div>
        </>
      )}
    </div>
  );
}
