"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "./ui/input";
import {
  createCar,
  createTempCar,
  searchCarHistory,
  searchTempCar,
} from "@/lib/appwrite";
import Image from "next/image";
import loader from "../../public/assets/t3-loader.gif";
import { toast } from "sonner";

import { MoveRight } from "lucide-react";
import {
  carMakeModels,
  carMakes,
  getAllCarMakes,
  purposeOfVisits,
} from "@/lib/helper";
import { useRouter } from "next/navigation";
import { SearchSelect } from "./SearchSelect";

type Props = {};

export default function AddCarCards({}: Props) {
  const router = useRouter();

  const [currentState, setCurrentState] = useState(0);

  const [carNumber, setCarNumber] = useState("");
  const [carMake, setCarMake] = useState("");
  const [carModel, setCarModel] = useState("");
  const [purposeOfVisit, setPurposeOfVisit] = useState("");
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const [isCorrectCarNumber, setIsCorrectCarNumber] = useState(false);
  const [isNewCar, setIsNewCar] = useState<string | null>(null);

  const [handleModelDisable, setHandleModelDisable] = useState(true);
  const [selectedCarMakeModels, setSelectedCarMakeModels] = useState<string[]>(
    []
  );

  function checkIndianCarNumber(inputText: string) {
    const indianCarNumberRegex =
      /^([A-Z]{2}\d{2}[A-Z]{1,2}\d{4})|(\d{2}BH\d{4}[A-Z]{2})$/;
    setCarNumber(inputText);
    setIsCorrectCarNumber((prev) => indianCarNumberRegex.test(inputText));
  }

  const handleContinueCarNumber = async () => {
    //
    setIsButtonLoading((prev) => true);

    let prevHistory = await searchCarHistory(carNumber);
    console.log("CAR HISTORY - ", prevHistory);

    let searchedTempCar = await searchTempCar(carNumber);
    console.log("CAR TEMP - ", searchedTempCar);

    if (
      searchedTempCar.total > 0 &&
      searchedTempCar.documents[0].carStatus == 0
    ) {
      toast("Vehicle Already in the System");
    } else {
      if (prevHistory.total == 0) {
        console.log("THIS IS A NEW CAR");
        setIsNewCar((prev) => null);
        //   console.log("Updated Details -", carDetails);
      } else {
        console.log("THIS IS AN OLD CAR", prevHistory.documents[0]["$id"]);
        setIsNewCar((prev) => prevHistory.documents[0]["$id"]);

        // let foundMake = carMakes.find(
        //   (make) => make.description == prevHistory.documents[0].carMake
        // );

        // console.log(foundMake);
      }

      setCurrentState((prev) => 1);
    }

    setIsButtonLoading((prev) => false);
  };

  const handleContinueEnterVehicle = async () => {
    setIsButtonLoading((prev) => true);

    if (carMake != "" && carModel != "" && purposeOfVisit != "") {
      if (isNewCar == null) {
        console.log("THIS IS A NEW CAR");
        try {
          const newCar = await createCar(
            carNumber,
            carMake,
            carModel,
            purposeOfVisit
          );
          console.log(newCar);

          await createTempCar(
            carNumber,
            carMake,
            carModel,
            purposeOfVisit,
            newCar.$id
          );

          toast("New Vehicle Entered \u2705");
          setTimeout(() => {
            router.push("/security");
          }, 1000);
        } catch {
          console.log("THERE WAS AN ERROR");
        }
      } else {
        console.log("THIS IS NOT A NEW CAR");
        try {
          await createTempCar(
            carNumber,
            carMake,
            carModel,
            purposeOfVisit,
            isNewCar!
          );
          toast("New Vehicle Entered \u2705");
          setTimeout(() => {
            router.push("/security");
          }, 2000);
        } catch {
          console.log("THERE WAS AN ERROR");
        }
      }
    } else {
      toast("Please enter all details");
    }

    setIsButtonLoading((prev) => false);
  };

  useEffect(() => {
    const handleCarMakeChange = (value: string) => {
      setHandleModelDisable((prev) => true);
      setCarMake((prev) => value);

      let foundObj = carMakeModels.find(
        (make: { company: string; models: string[] }) => make.company == value
      );

      if (foundObj) {
        setSelectedCarMakeModels(foundObj!.models);
        setHandleModelDisable((prev) => false);
      }
    };

    handleCarMakeChange(carMake);
  }, [carMake]);

  return (
    <div className="flex flex-col w-full space-y-5">
      <div className="flex w-full flex-col space-y-5">
        <Input
          id="carNumber"
          placeholder="Car Number"
          onChange={(e) => checkIndianCarNumber(e.target.value)}
          disabled={currentState != 0}
        />
        {currentState == 0 && (
          <Button
            color="#EF4444"
            disabled={!isCorrectCarNumber}
            onClick={handleContinueCarNumber}
          >
            {isButtonLoading ? (
              <Image src={loader} width={50} height={50} alt="Logo" />
            ) : (
              <div>Next</div>
            )}
          </Button>
        )}
      </div>
      {currentState == 1 && (
        <div className="flex w-full flex-col space-y-5">
          <div className="w-full">
            <SearchSelect
              data={getAllCarMakes()}
              type="Car Makes"
              setDataValue={setCarMake}
            />
          </div>
          <div>
            <SearchSelect
              data={selectedCarMakeModels}
              type="Car Models"
              setDataValue={setCarModel}
              disabled={handleModelDisable}
            />
          </div>
          <div>
            <Select
              onValueChange={(value) => {
                setPurposeOfVisit(value);
              }}
            >
              <SelectTrigger className="w-full p-2 border border-gray-200 rounded-lg">
                <SelectValue placeholder="Select Purpose of Visit" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {purposeOfVisits.map((pov, index) => (
                  <SelectItem key={index} value={pov.description}>
                    {pov.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            color="#EF4444"
            // disabled={
            //   !(carMake != "" && carModel != "" && purposeOfVisit != "")
            // }
            onClick={handleContinueEnterVehicle}
          >
            {isButtonLoading ? (
              <Image src={loader} width={50} height={50} alt="Logo" />
            ) : (
              <div>Enter Vehicle</div>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
