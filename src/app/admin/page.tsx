"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { deleteCookie, getCookie } from "cookies-next";
import PrimaryButton from "@/components/PrimaryButton";
import { JobCardsDataTable } from "@/components/data-tables/job-cards-data-table";
import DisplayCard from "@/components/DisplayCard";
import PartsPageSkeleton from "@/components/skeletons/PartsPageSkeleton";
import { CarFront, Wrench, ListChecks, Plus } from "lucide-react";
import { tempCarsColumns } from "@/lib/column-definitions";
import {
  getAllCars,
  getAllInvoices,
  getAllJobCards,
  getAllLabour,
  getAllParts,
  getAllTempCars,
} from "@/lib/appwrite";
import { TempCarsDataTable } from "@/components/data-tables/temp-cars-data-table";
import {
  Car,
  Invoice,
  JobCard,
  Labour,
  Part,
  TempCar,
} from "@/lib/definitions";

type Props = {};

export default function Admin({}: Props) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [tempCars, setTempCars] = useState<TempCar[] | null>(null);
  const [jobCards, setJobCards] = useState<JobCard[] | null>(null);
  const [parts, setParts] = useState<Part[] | null>(null);
  const [labours, setLabours] = useState<Labour[] | null>(null);
  const [cars, setCars] = useState<Car[] | null>(null);
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);

  useEffect(() => {
    const getUser = () => {
      const token = getCookie("user");

      const parsedToken = JSON.parse(String(token));
      //   console.log(parsedToken);
      setName(parsedToken.name);
    };

    const getJobCards = async () => {
      const allJobCards = await getAllJobCards();
      setJobCards(allJobCards.documents);
    };

    const getTempCars = async () => {
      const allTempCars = await getAllTempCars();
      setTempCars(allTempCars);
    };

    const getParts = async () => {
      const partsObj = await getAllParts();
      // console.log("THESE ARE THE PARTS - ", partsObj);
      setParts((prev) => partsObj.documents);
    };

    const getLabour = async () => {
      const labourObj = await getAllLabour();
      // console.log("THESE ARE THE Labours - ", labourObj);
      setLabours((prev) => labourObj.documents);
    };

    const getCars = async () => {
      const carsObj = await getAllCars();
      // console.log("THESE ARE THE Labours - ", labourObj);
      setCars((prev) => carsObj.documents);
    };

    const getInvoices = async () => {
      const invoicesObj = await getAllInvoices();
      // console.log("THESE ARE THE Labours - ", labourObj);
      setInvoices((prev) => invoicesObj.documents);
    };

    getUser();
    getJobCards();
    getCars();
    getTempCars();
    getParts();
    getLabour();
    getInvoices();
  }, []);

  return (
    <div className="flex flex-col w-[90%] mt-20">
      {!(
        name &&
        tempCars &&
        cars &&
        jobCards &&
        parts &&
        labours &&
        invoices
      ) ? (
        <PartsPageSkeleton />
      ) : (
        <>
          <div>
            <div className="font-semibold text-3xl">Hello {name}! </div>
            <div className="font-medium">T3, Mira Road</div>
          </div>
        </>
      )}
    </div>
  );
}
