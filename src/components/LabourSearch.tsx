import { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { CurrentLabour, CurrentPart, Labour, Part } from "@/lib/definitions";
import { taxAmtHelper } from "@/lib/helper";

export default function LabourSearch({
  items,
  currentLabours,
  setCurrentLabour,
  setIsEdited,
}: {
  items: Labour[] | null;
  currentLabours: CurrentLabour[] | null;
  setCurrentLabour: any;
  setIsEdited: any;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Labour[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (items) {
      const searchResults = items.filter((item) => {
        const value: any = item.labourCode;
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
    console.log("CURRENT PARTS - ", currentLabours);

    let currentLabourObj = {
      $id: item.$id,
      labourName: item.labourName,
      labourCode: item.labourCode,
      hsn: item.hsn,
      category: item.category,
      mrp: item.mrp,
      gst: item.gst,
      quantity: 1,
      amount: taxAmtHelper(item.mrp, 1, item.gst, "value"),
    };

    if (currentLabours) {
      console.log("THERE EXISTS CURRENT LABOURS");
      let findIndex = currentLabours?.findIndex(
        (labour) => labour.$id == item.$id
      );
      // console.log(findIndex);

      if (findIndex != -1) {
        console.log("Selected Item Does not Exist in Current Labours");
        let arrayFirstHalf = currentLabours.slice(0, findIndex);
        let arraySecondHalf = currentLabours.slice(findIndex + 1);

        currentLabourObj.quantity = currentLabours[findIndex].quantity + 1;

        let newTaxAmt = taxAmtHelper(
          currentLabourObj.mrp,
          currentLabourObj.quantity,
          currentLabourObj.gst,
          "value"
        );

        currentLabourObj.amount = newTaxAmt;

        setCurrentLabour([
          ...arrayFirstHalf,
          currentLabourObj,
          ...arraySecondHalf,
        ]);
      } else {
        setCurrentLabour([...currentLabours, currentLabourObj]);
      }
    } else {
      setCurrentLabour([currentLabourObj]);
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
              key={item.labourCode}
              className="p-2 text-wrap cursor-pointer"
              onClick={() => handleSelect(item)}
            >
              <span className="font-medium">{item.labourName}</span>
              <span className="mx-2">-</span>
              <span>{item.labourCode}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
