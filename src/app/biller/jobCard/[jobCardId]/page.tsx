"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, Shield } from "lucide-react";
import {
  getAllInvoices,
  getAllLabour,
  getAllParts,
  getInvoicesByJobCardId,
  getJobCardById,
  getTempCarById,
  updateJobCardById,
  updateJobCardInsuranceDetails,
} from "@/lib/appwrite";
import { CarFront, User } from "lucide-react";
import DetailsCard from "@/components/DetailsCard";
import Link from "next/link";
import JobDetailsCard from "@/components/JobDetailsCard";
import { Button } from "@/components/ui/button";
import {
  amtHelperWithoutTax,
  calcAllAmts,
  createTaxObj,
  invoiceTypes,
  objToStringArr,
  policyProviders,
  purposeOfVisits,
  stringToObj,
} from "@/lib/helper";
import { toast } from "sonner";
import {
  JobCard,
  Car,
  Part,
  CurrentPart,
  Labour,
  CurrentLabour,
  UserType,
  Invoice,
  TaxObj,
} from "@/lib/definitions";
import {
  currentPartsColumns,
  currentLabourColumns,
} from "@/lib/column-definitions";
import { CurrentPartsDataTable } from "@/components/data-tables/current-parts-data-table";
import JobCardsPageSkeleton from "@/components/skeletons/JobCardPageSkeleton";
import { CurrentLabourDataTable } from "@/components/data-tables/current-labour-data-table";
import { getCookie } from "cookies-next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchSelect } from "@/components/SearchSelect";
import { usePathname } from "next/navigation";
import Image from "next/image";
import loader from "../../../../../public/assets/t3-loader.gif";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define the structure for the Car object

export default function jobCard({ params }: { params: { jobCardId: any } }) {
  const pathname = usePathname();

  const [jobCard, setJobCard] = useState<JobCard | null>(null); // Properly typed state
  const [car, setCar] = useState<Car | null>(null); // Properly typed state
  const [parts, setParts] = useState<Part[] | null>(null);
  const [labours, setLabours] = useState<Labour[] | null>(null);
  const [currentParts, setCurrentParts] = useState<CurrentPart[]>([]);
  const [currentLabour, setCurrentLabour] = useState<CurrentLabour[]>([]);
  const [currentJobCardStatus, setCurrentJobCardStatus] = useState<number>();
  const [user, setUser] = useState<UserType>();

  const [policyProvider, setPolicyProvider] = useState<string>();
  const [policyNumber, setPolicyNumber] = useState<string>();
  const [isInsuranceDetails, setIsInsuranceDetails] = useState(false);

  const [isEdited, setIsEdited] = useState(false);

  const [jobCardInvoices, setJobCardInvoices] = useState<Invoice[]>();

  const [invoiceCounter, setInvoiceCounter] = useState(0);

  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    // console.log("THERE WAS AN EDIT");

    const updateJobCardStatus = async () => {
      if (jobCard?.jobCardStatus)
        await updateJobCardById(
          params.jobCardId,
          jobCard?.parts,
          jobCard?.labour,
          2
        );
      setCurrentJobCardStatus(2);
    };

    updateJobCardStatus();
    setIsEdited(false);
  }, [isEdited]);

  useEffect(() => {
    console.log("THERE WAS A CHANGE - ", currentParts, currentLabour);
  }, [currentParts, currentLabour]);

  useEffect(() => {
    const getUser = () => {
      const token = getCookie("user");

      const parsedToken = JSON.parse(String(token));
      setUser((prev) => parsedToken);
      console.log(parsedToken);
    };

    const getJobCardDetails = async () => {
      const jobCardObj = await getJobCardById(params.jobCardId);
      console.log("This is the Job Card - ", jobCardObj);

      const prevParts = stringToObj(jobCardObj.parts);
      console.log("Current Parts - ", prevParts);
      setCurrentParts(prevParts);

      const prevLabour = stringToObj(jobCardObj.labour);
      setCurrentLabour(prevLabour);

      const carObj = await getTempCarById(jobCardObj.carId);
      // console.log("This is the car details - ", carObj);

      if (jobCardObj.insuranceDetails) {
        setIsInsuranceDetails(true);
        const details = JSON.parse(jobCardObj.insuranceDetails);
        setPolicyProvider(details.policyProvider);
        setPolicyNumber(details.policyNumber);
        console.log("DETAILS", details);
      } else {
        setIsInsuranceDetails(false);
      }

      setJobCard((prev) => jobCardObj);
      setCurrentJobCardStatus(jobCardObj.jobCardStatus);
      setCar((prev) => carObj);
    };

    const getJobCardInvoices = async () => {
      const invoices = await getAllInvoices();
      // console.log("THE INVOICES ARE = ", invoices);

      setInvoiceCounter(invoices.documents[0].invoiceNumber + 1);

      const jobCardInvoicesArr = invoices.documents.filter(
        (invoice: Invoice) => invoice.jobCardId == params.jobCardId
      );

      console.log("INVOICES FOR THIS JC - ", jobCardInvoicesArr);

      setJobCardInvoices(jobCardInvoicesArr);
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

    getUser();

    getParts();

    getLabour();

    getJobCardInvoices();

    getJobCardDetails();
  }, []);

  const saveCurrentPartsAndLbour = async (statusUpdate?: number) => {
    console.log("Current Parts - ", currentParts);
    console.log("CURRENT LABOUR - ", currentLabour);

    let status = 2;

    if (statusUpdate) {
      status = statusUpdate;
    }

    const parts = objToStringArr(currentParts);
    const labour = objToStringArr(currentLabour);

    const amounts = calcAllAmts(currentParts, currentLabour);
    const taxes: TaxObj[] = createTaxObj(currentParts, currentLabour);

    console.log("TAXES ON THE FRONT - ", taxes);

    const strTaxes = objToStringArr(taxes);

    console.log("THESE ARE THE AMOUNTS - ", amounts);

    let tempJobCard = jobCard;
    if (tempJobCard) {
      tempJobCard.subTotal = amounts.subTotal;
      tempJobCard.discountAmt = amounts.discountAmt;
      tempJobCard.amount = amounts.amount;

      setJobCard((prev) => tempJobCard);
    }

    const isDone = await updateJobCardById(
      params.jobCardId,
      parts,
      labour,
      status,
      amounts.subTotal,
      amounts.discountAmt,
      amounts.amount,
      strTaxes
    );

    console.log(isDone);

    setCurrentJobCardStatus(2);

    if (isDone) {
      // console.log("IT IS DONE");
      toast("Job Card has been updated \u2705");
    }
  };

  const generateQuote = async () => {
    setButtonLoading((prev) => true);
    await saveCurrentPartsAndLbour(3);

    console.log("JOB CARD OBJ = ", jobCard);

    await fetch(`http://localhost:3000${pathname}/invoice`, {
      method: "POST",
      body: JSON.stringify({
        jobCard,
        car,
        currentParts,
        currentLabour,
        currentJobCardStatus,
        invoiceCounter,
      }),
    }).then((result: any) => {
      result.json().then((invoiceDetails: any) => {
        openInNewTab(invoiceDetails.invoiceUrl);
      });
      setButtonLoading((prev) => false);
      setCurrentJobCardStatus(3);

      toast("Quote Generated \u2705");
    });
  };

  const generateProFormaInvoice = async () => {
    setButtonLoading((prev) => true);
    await saveCurrentPartsAndLbour(4);

    await fetch(`http://localhost:3000${pathname}/invoice`, {
      method: "POST",
      body: JSON.stringify({
        jobCard,
        car,
        currentParts,
        currentLabour,
        currentJobCardStatus,
        invoiceCounter,
      }),
    }).then((result: any) => {
      result.json().then((invoiceDetails: any) => {
        openInNewTab(invoiceDetails.invoiceUrl);
      });
      setButtonLoading((prev) => false);
      setCurrentJobCardStatus(4);

      toast("Pro-Forma Invoice Generated \u2705");
    });
  };

  const generateTaxInvoice = async () => {
    setButtonLoading((prev) => true);
    await saveCurrentPartsAndLbour(5);

    await fetch(`http://localhost:3000${pathname}/invoice`, {
      method: "POST",
      body: JSON.stringify({
        jobCard,
        car,
        currentParts,
        currentLabour,
        currentJobCardStatus,
        invoiceCounter,
      }),
    }).then((result: any) => {
      result.json().then((invoiceDetails: any) => {
        openInNewTab(invoiceDetails.invoiceUrl);
      });
      setButtonLoading((prev) => false);
      setCurrentJobCardStatus(5);

      toast("Tax Invoice Generated \u2705");
    });
  };

  const saveInsuranceDetails = async () => {
    const insuranceDetails = JSON.stringify({
      policyProvider: policyProvider,
      policyNumber: policyNumber,
    });

    console.log(insuranceDetails);

    const isDone = await updateJobCardInsuranceDetails(
      params.jobCardId,
      insuranceDetails
    );

    console.log(isDone);
    if (isDone) {
      // console.log("IT IS DONE");
      toast("Insurance Details have been Updated \u2705");
      setIsInsuranceDetails(true);
    }
  };

  const openInNewTab = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleInvoicePDF = (selectedValue: string) => {
    console.log("SELECTED PDF - ", selectedValue);
    console.log(jobCardInvoices);
    if (jobCardInvoices) {
      const filteredInvoices: Invoice[] = jobCardInvoices?.filter(
        (invoice: Invoice) => invoice.invoiceType == selectedValue
      );
      filteredInvoices?.sort(
        (a, b) =>
          new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
      );
      const selectedInvoice = filteredInvoices[0];
      openInNewTab(selectedInvoice.invoiceUrl);
    }
  };

  return (
    <div className="flex flex-col w-[90%] mt-5 space-y-8">
      {!(parts && jobCard && car && user) ? (
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
            <div className="flex flex-row space-x-5 justify-normal items-center">
              {currentJobCardStatus! > 2 && (
                <div>
                  <Select
                    onValueChange={(value) => {
                      handleInvoicePDF(value);
                    }}
                  >
                    <SelectTrigger className="w-full p-2 border border-red-500 text-red-500 rounded-lg">
                      <SelectValue placeholder="Download" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      {invoiceTypes.map((invoiceType, index) => (
                        <div key={index}>
                          {invoiceType.code <= currentJobCardStatus! && (
                            <SelectItem
                              key={index}
                              value={invoiceType.description}
                            >
                              {invoiceType.description}
                            </SelectItem>
                          )}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {currentJobCardStatus == 1 && (
                <Button
                  variant="outline"
                  className="px-8 py-2 bg-red-500 text-white hover:bg-red-400 hover:text-white"
                  size="lg"
                  onClick={() => saveCurrentPartsAndLbour()}
                >
                  Save
                </Button>
              )}
              {currentJobCardStatus == 2 && (
                <Button
                  variant="outline"
                  className={`px-8 py-2 bg-red-500 text-white hover:bg-red-400 hover:text-white ${
                    buttonLoading ? "opacity-50" : ""
                  }`}
                  size="lg"
                  onClick={generateQuote}
                  disabled={buttonLoading}
                >
                  {buttonLoading ? (
                    <>
                      <Image src={loader} width={50} height={50} alt="Logo" />
                    </>
                  ) : (
                    <>Generate Quote</>
                  )}
                </Button>
              )}
              {currentJobCardStatus == 3 && (
                <Button
                  variant="outline"
                  className={`px-8 py-2 bg-red-500 text-white hover:bg-red-400 hover:text-white ${
                    buttonLoading ? "opacity-50" : ""
                  }`}
                  size="lg"
                  onClick={generateProFormaInvoice}
                  disabled={buttonLoading}
                >
                  {buttonLoading ? (
                    <>
                      <Image src={loader} width={50} height={50} alt="Logo" />
                    </>
                  ) : (
                    <>Generate Pro-Forma Invoice</>
                  )}
                </Button>
              )}
              {currentJobCardStatus == 4 && (
                <Button
                  variant="outline"
                  className={`px-8 py-2 bg-red-500 text-white hover:bg-red-400 hover:text-white ${
                    buttonLoading ? "opacity-50" : ""
                  }`}
                  size="lg"
                  onClick={generateTaxInvoice}
                  disabled={buttonLoading}
                >
                  {buttonLoading ? (
                    <>
                      <Image src={loader} width={50} height={50} alt="Logo" />
                    </>
                  ) : (
                    <>Generate Tax Invoice</>
                  )}
                </Button>
              )}
              {currentJobCardStatus == 5 && (
                <Button
                  variant="outline"
                  className={`px-8 py-2 bg-red-500 text-white hover:bg-red-400 hover:text-white ${
                    buttonLoading ? "opacity-50" : ""
                  }`}
                  size="lg"
                  // onClick={generateTaxInvoice}
                  disabled={buttonLoading}
                >
                  {buttonLoading ? (
                    <>
                      <Image src={loader} width={50} height={50} alt="Logo" />
                    </>
                  ) : (
                    <>Generate Gate Pass</>
                  )}
                </Button>
              )}
            </div>
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
                <div>#JobCardNumber : {jobCard.jobCardNumber}</div>
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
            <div className="flex flex-col space-y-8">
              <JobDetailsCard
                data={{ jobCard, car }}
                diagnosis={jobCard?.diagnosis}
              />
              {isInsuranceDetails && (
                <DetailsCard
                  title="Insurance Details"
                  icon={<Shield />}
                  dataHead={policyProvider}
                  data={{ policyNumber: policyNumber }}
                />
              )}
              <div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="border bordre-red-500 text-red-500"
                    >
                      {isInsuranceDetails
                        ? "Edit Insurance Details"
                        : "Add Insurance Details"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Insurance Details</DialogTitle>
                      <DialogDescription>
                        Enter the details of your vehicle insurance
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="policyProvider" className="text-right">
                          Policy Provider
                        </Label>
                        <div className="col-span-3">
                          <SearchSelect
                            id="policyProvider"
                            data={policyProviders}
                            type="Policy Providers"
                            setDataValue={setPolicyProvider}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="policyNumber" className="text-right">
                          Policy Number
                        </Label>
                        <Input
                          id="policyNumber"
                          className="col-span-3"
                          onChange={(event) =>
                            setPolicyNumber(event.target.value)
                          }
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="submit"
                        className="bg-red-500"
                        onClick={saveInsuranceDetails}
                      >
                        Save
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
          <div className="font-semibold text-3xl">Invoice Details</div>

          <div className="flex flex-col space-y-8">
            <CurrentPartsDataTable
              columns={currentPartsColumns}
              data={currentParts}
              currentParts={currentParts}
              parts={parts}
              setCurrentParts={setCurrentParts}
              setIsEdited={setIsEdited}
              user={user}
              currentJobCardStatus={currentJobCardStatus}
              isInsuranceDetails={isInsuranceDetails}
            />
            <CurrentLabourDataTable
              columns={currentLabourColumns}
              data={currentLabour}
              labour={labours}
              currentLabours={currentLabour}
              setCurrentLabour={setCurrentLabour}
              setIsEdited={setIsEdited}
              user={user}
              currentJobCardStatus={currentJobCardStatus}
              isInsuranceDetails={isInsuranceDetails}
            />
          </div>
        </>
      )}
    </div>
  );
}
