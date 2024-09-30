"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import {
  getAllLabour,
  getAllParts,
  getJobCardById,
  getTempCarById,
  updateJobCardById,
} from "@/app/lib/appwrite";
import { CarFront, User } from "lucide-react";
import DetailsCard from "@/components/DetailsCard";
import Link from "next/link";
import JobDetailsCard from "@/components/JobDetailsCard";
import { Button } from "@/components/ui/button";
import { objToStringArr, stringToObj } from "@/app/lib/helper";
import { toast } from "sonner";
import {
  JobCard,
  Car,
  Part,
  CurrentPart,
  Labour,
  CurrentLabour,
} from "@/app/lib/definitions";
import {
  currentPartsColumns,
  currentLabourColumns,
} from "@/app/lib/column-definitions";
import { CurrentPartsDataTable } from "@/components/data-tables/current-parts-data-table";
import JobCardsPageSkeleton from "@/components/skeletons/JobCardPageSkeleton";
import { CurrentLabourDataTable } from "@/components/data-tables/current-labour-data-table";

// Define the structure for the Car object

export default function jobCard({ params }: { params: { jobCardId: any } }) {
  const [jobCard, setJobCard] = useState<JobCard | null>(null); // Properly typed state
  const [car, setCar] = useState<Car | null>(null); // Properly typed state
  const [parts, setParts] = useState<Part[] | null>(null);
  const [labours, setLabours] = useState<Labour[] | null>(null);
  const [currentParts, setCurrentParts] = useState<CurrentPart[]>([]);
  const [currentLabour, setCurrentLabour] = useState<CurrentLabour[]>([]);
  const [currentJobCardStatus, setCurrentJobCardStatus] = useState<number>();

  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    console.log("THERE WAS AN EDIT");

    const updateJobCardStatus = async () => {
      if (jobCard?.jobCardStatus)
        await updateJobCardById(
          params.jobCardId,
          jobCard?.parts,
          jobCard?.labour,
          1
        );
      setCurrentJobCardStatus(1);
    };

    updateJobCardStatus();
  }, [isEdited]);

  useEffect(() => {
    const getJobCardDetails = async () => {
      const jobCardObj = await getJobCardById(params.jobCardId);
      console.log("This is the Job Card - ", jobCardObj);

      const prevParts = stringToObj(jobCardObj.parts);
      setCurrentParts(prevParts);

      const prevLabour = stringToObj(jobCardObj.labour);
      setCurrentLabour(prevLabour);

      const carObj = await getTempCarById(jobCardObj.carId);
      console.log("This is the car details - ", carObj);

      setJobCard((prev) => jobCardObj);
      setCurrentJobCardStatus(jobCardObj.jobCardStatus);
      setCar((prev) => carObj);
    };

    const getParts = async () => {
      const partsObj = await getAllParts();
      console.log("THESE ARE THE PARTS - ", partsObj);
      setParts((prev) => partsObj.documents);
    };

    const getLabour = async () => {
      const labourObj = await getAllLabour();
      console.log("THESE ARE THE Labours - ", labourObj);
      setLabours((prev) => labourObj.documents);
    };

    getParts();

    getLabour();

    getJobCardDetails();
  }, []);

  const saveCurrentPartsAndLbour = async () => {
    console.log("Current Parts - ", currentParts);
    console.log("CURRENT LABOUR - ", currentLabour);
    const parts = objToStringArr(currentParts);
    const labour = objToStringArr(currentLabour);

    const isDone = await updateJobCardById(params.jobCardId, parts, labour, 2);

    setCurrentJobCardStatus(2);

    if (isDone) {
      // console.log("IT IS DONE");
      toast("Job Card has been updated \u2705");
    }
  };

  const generateQuote = async () => {
    const isDone = await updateJobCardById(
      params.jobCardId,
      jobCard?.parts,
      jobCard?.labour,
      3
    );

    setCurrentJobCardStatus(3);

    if (isDone) {
      // console.log("IT IS DONE");
      toast("Quote Generated \u2705");
    }
  };

  const generateProFormaInvoice = async () => {
    const isDone = await updateJobCardById(
      params.jobCardId,
      jobCard?.parts,
      jobCard?.labour,
      4
    );

    setCurrentJobCardStatus(4);

    if (isDone) {
      // console.log("IT IS DONE");
      toast("Pro-Forma Invoice Generated \u2705");
    }
  };

  const generateTaxInvoice = async () => {
    const isDone = await updateJobCardById(
      params.jobCardId,
      jobCard?.parts,
      jobCard?.labour,
      5
    );

    setCurrentJobCardStatus(5);

    if (isDone) {
      // console.log("IT IS DONE");
      toast("Tax Invoice Generated \u2705");
    }
  };

  useEffect(() => {
    console.log("THERE WAS A CHANGE - ", currentParts, currentLabour);
  }, [currentParts, currentLabour]);

  return (
    <div className="flex flex-col w-[90%] mt-5 space-y-8">
      {!(parts && jobCard && car) ? (
        <JobCardsPageSkeleton />
      ) : (
        <>
          <div className="sticky top-5 flex w-full justify-between items-center shadow-md p-4 rounded-lg border border-gray-300 bg-white">
            <div className="text-red-700">
              <Link href="/parts" className="flex space-x-4">
                <div>
                  <ArrowLeft />
                </div>
                <div>Back to All Job cards</div>
              </Link>
            </div>
            {currentJobCardStatus == 1 && (
              <Button
                variant="outline"
                className="px-8 py-2 bg-red-500 text-white hover:bg-red-400 hover:text-white"
                size="lg"
                onClick={saveCurrentPartsAndLbour}
              >
                Save
              </Button>
            )}
            {currentJobCardStatus == 2 && (
              <Button
                variant="outline"
                className="px-8 py-2 bg-red-500 text-white hover:bg-red-400 hover:text-white"
                size="lg"
                onClick={generateQuote}
              >
                Generate Quote
              </Button>
            )}
            {currentJobCardStatus == 3 && (
              <Button
                variant="outline"
                className="px-8 py-2 bg-red-500 text-white hover:bg-red-400 hover:text-white"
                size="lg"
                // onClick={generateQuote}
              >
                Generate Pro-Forma Invoice
              </Button>
            )}
            {currentJobCardStatus == 4 && (
              <Button
                variant="outline"
                className="px-8 py-2 bg-red-500 text-white hover:bg-red-400 hover:text-white"
                size="lg"
                // onClick={generateQuote}
              >
                Generate Tax Invoice
              </Button>
            )}
          </div>
          <div>
            <div>
              <div>
                <span className="font-semibold text-3xl">
                  {jobCard.carNumber}
                </span>
                <span className="font-medium ml-2 text-2xl text-gray-700">{`(${car.carMake} ${car.carModel})`}</span>
              </div>
              <div className="font-medium text-gray-500">
                #JobCardId : {jobCard.$id}
              </div>
            </div>
          </div>
          <div className="flex flex-row space-x-8">
            <div className="flex flex-col space-y-5">
              <DetailsCard
                title="Customer Details"
                icon={<User />}
                dataHead={jobCard?.customerName}
                data={{ customerPhone: jobCard?.customerPhone }}
              />
              <DetailsCard
                title="Vehicle Details"
                icon={<CarFront />}
                dataHead={jobCard?.carNumber}
                data={{ makeModel: `${car?.carMake} ${car?.carModel}` }}
              />
            </div>
            <div>
              <JobDetailsCard
                data={{ jobCard, car }}
                diagnosis={jobCard?.diagnosis}
              />
            </div>
          </div>
          <div className="font-semibold text-3xl">Invoice Details</div>

          <div className="flex flex-row space-x-5 pb-10">
            <CurrentPartsDataTable
              columns={currentPartsColumns}
              data={currentParts}
              currentParts={currentParts}
              parts={parts}
              setCurrentParts={setCurrentParts}
              setIsEdited={setIsEdited}
            />
            <CurrentLabourDataTable
              columns={currentLabourColumns}
              data={currentLabour}
              labour={labours}
              currentLabours={currentLabour}
              setCurrentLabour={setCurrentLabour}
              setIsEdited={setIsEdited}
            />
          </div>
        </>
      )}
    </div>
  );
}