"use client";

import React, { useEffect, useState } from "react";
import { Labour, Part } from "@/lib/definitions";
import { labourColumns } from "@/lib/column-definitions";
import { PartsDataTable } from "@/components/data-tables/parts-data-table";
import InventoryPageSkeleton from "@/components/skeletons/InventoryPageSkeleton";
import { getAllLabour } from "@/lib/appwrite";
import { LabourDataTable } from "@/components/data-tables/labour-data-table";

type Props = {};

export default function PartsInventory({}: Props) {
  const [labour, setLabour] = useState<Labour[]>([]);

  useEffect(() => {
    const getLabour = async () => {
      const labourObj = await getAllLabour();
      console.log("THESE ARE THE PARTS - ", labourObj);
      setLabour((prev) => labourObj.documents);
    };

    getLabour();
  }, []);

  return (
    <div className="flex flex-col w-[90%] mt-10">
      {!(labour.length > 0) ? (
        <InventoryPageSkeleton />
      ) : (
        <>
          <div>
            <div className="font-semibold text-3xl">Labour Inventory</div>
            <div className="font-medium">
              These are the Labour currently in the inventory
            </div>
          </div>
          <div className="mt-8">
            {labour && (
              <LabourDataTable columns={labourColumns} data={labour} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
