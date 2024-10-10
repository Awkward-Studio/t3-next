import { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { CurrentPart, Part } from "@/lib/definitions";
import { taxAmtHelper } from "@/lib/helper";

export default function PartsSearch({
  items,
  currentParts,
  setCurrentParts,
  setIsEdited,
}: {
  items: Part[] | null;
  currentParts: CurrentPart[] | null;
  setCurrentParts: any;
  setIsEdited: any;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Part[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (items) {
      const searchResults = items.filter((item) => {
        const value: any = item.partNumber;
        if (typeof value === "string") {
          return value.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return false; // Handle non-string values as needed
      });
      setSearchResults(searchResults);
    }
  }, [items, searchTerm]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    searchInputRef.current?.focus(); // Keep focus on the input field
  };

  const handleSelect = (item: any) => {
    console.log("Clicked Part - ", item);
    console.log("CURRENT PARTS - ", currentParts);

    let currentPartObj = {
      $id: item.$id,
      partName: item.partName,
      partNumber: item.partNumber,
      hsn: item.hsn,
      category: item.category,
      mrp: item.mrp,
      gst: item.gst,
      quantity: 1,
      amount: taxAmtHelper(item.mrp, 1, item.gst, "value"),
    };

    if (currentParts) {
      let findIndex = currentParts?.findIndex((part) => part.$id == item.$id);
      // console.log(findIndex);

      if (findIndex != -1) {
        let arrayFirstHalf = currentParts.slice(0, findIndex);
        let arraySecondHalf = currentParts.slice(findIndex + 1);

        currentPartObj.quantity = currentParts[findIndex].quantity + 1;

        let newTaxAmt = taxAmtHelper(
          currentPartObj.mrp,
          currentPartObj.quantity,
          currentPartObj.gst,
          "value"
        );

        currentPartObj.amount = newTaxAmt;

        setCurrentParts([
          ...arrayFirstHalf,
          currentPartObj,
          ...arraySecondHalf,
        ]);
      } else {
        setCurrentParts([...currentParts, currentPartObj]);
      }
    } else {
      setCurrentParts([currentPartObj]);
    }
    setIsEdited(true);
  };

  return (
    <div>
      <Input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search"
        ref={searchInputRef}
        className="focus:border-red-400 focus:border-2 w-[308px]"
      />
      {searchTerm && (
        <ul className="flex flex-col border border-gray-200 rounded-lg p-3 mt-2 divide-y-2 divide-solid w-[308px] h-fit max-h-[400px]">
          {searchResults.map((item) => (
            <li
              key={item.partNumber}
              className="p-2 text-wrap cursor-pointer"
              onClick={() => handleSelect(item)}
            >
              <span className="font-medium">{item.partName}</span>
              <span className="mx-2">-</span>
              <span>{item.partNumber}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
