"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import logo from "../../../../../../public/assets/Logomark.png";
import { usePathname } from "next/navigation";
import { getJobCardById, getTempCarById } from "@/lib/appwrite";
import { Car, CurrentLabour, CurrentPart, JobCard } from "@/lib/definitions";
import { stringToObj } from "@/lib/helper";

export default function page() {
  const pathname = usePathname();

  const [jobCard, setJobCard] = useState<JobCard | null>(null);
  const [car, setCar] = useState<Car | null>(null);

  const [parts, setParts] = useState<CurrentPart[] | null>(null);
  const [labour, setLabour] = useState<CurrentLabour[] | null>(null);

  const currentDate = new Date();

  useEffect(() => {
    const getJobCardDetails = async () => {
      const jobCardId = pathname.slice(16, 36);
      const jobCardObj = await getJobCardById(jobCardId);
      console.log("This is the Job Card - ", jobCardObj);

      const carObj = await getTempCarById(jobCardObj.carId);
      console.log("This is the car details - ", carObj);

      const prevParts = stringToObj(jobCardObj.parts);
      setParts(prevParts);

      const prevLabour = stringToObj(jobCardObj.labour);
      setLabour(prevLabour);

      setJobCard((prev) => jobCardObj);
      setCar((prev) => carObj);
    };

    getJobCardDetails();
  }, []);

  return (
    <div className="flex  flex-col max-w-4xl mx-auto p-8 bg-white border border-gray-300">
      {jobCard && parts && labour && (
        <>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">T3 ALL CAR SERVICE</h2>
          </div>
          <div className="flex justify-between font-medium text-right text-sm">
            <Image src={logo} width={100} height={50} alt="Logo" />
            <div>
              <h3 className="text-md font-bold">CHAMUNDA MOTORS PVT LTD</h3>
              <p className="text-right text-sm">
                21/1-1, RAM BAUGH, OFF S V ROAD, <br />
                BORIVALI WEST, MUMBAI SUBURBAN,
                <br />
              </p>
              <div className="font-bold">GST NO: 27AAACC1903H1Z4</div>
            </div>
          </div>

          <div className="mb-6 text-center font-bold">Tax Invoice</div>

          <div className="flex flex-row justify-evenly space-x-3 text-xs font-semibold mb-10">
            <div className="border border-black h-fit">
              <table className="table-auto border-collapse w-full">
                <thead>
                  <tr className="bg-gray-200 border border-black">
                    <th
                      className="text-center font-bold border border-black"
                      colSpan={2}
                    >
                      Customer Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border border-black">
                    <td className=" border border-black font-bold">Name:</td>
                    <td className=" border border-black">
                      {jobCard?.customerName}
                    </td>
                  </tr>
                  <tr className="border border-black">
                    <td className=" border border-black font-bold">Mobile:</td>
                    <td className=" border border-black">
                      {jobCard?.customerPhone}
                    </td>
                  </tr>
                  <tr className="border border-black">
                    <td className=" border border-black font-bold">
                      Email ID:
                    </td>
                    <td className=" border border-black">-</td>
                  </tr>
                  <tr className="border border-black">
                    <td className=" border border-black font-bold">Address:</td>
                    <td className=" border border-black">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="border h-fit border-black">
              <table className="table-auto border-collapse w-full">
                <thead>
                  <tr className="bg-gray-200 border border-black">
                    <th className="text-center font-bold" colSpan={2}>
                      Vehicle Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border border-black">
                    <td className=" border border-black font-bold">
                      Registration:
                    </td>
                    <td className=" border border-black">
                      {jobCard?.carNumber}
                    </td>
                  </tr>
                  <tr className="border border-black">
                    <td className=" border border-black font-bold">Make:</td>
                    <td className=" border border-black">{car?.carMake}</td>
                  </tr>
                  <tr className="border border-black">
                    <td className=" border border-black font-bold">Model:</td>
                    <td className=" border border-black">{car?.carModel}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="border border-black h-fit">
              <table className="table-auto border-collapse w-full">
                <thead>
                  <tr className="bg-gray-200 border border-black">
                    <th
                      className="text-center font-bold  border border-black"
                      colSpan={2}
                    >
                      Invoice Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border border-black">
                    <td className=" border border-black font-bold">
                      Invoice No:
                    </td>
                    <td className=" border border-black">SER/5171</td>
                  </tr>
                  <tr className="border border-black">
                    <td className=" border border-black font-bold">
                      Invoice Date:
                    </td>
                    <td className=" border border-black">
                      {currentDate.toLocaleDateString()}
                    </td>
                  </tr>
                  <tr className="border border-black">
                    <td className=" border border-black font-bold">SO No.:</td>
                    <td className=" border border-black">7722</td>
                  </tr>
                  <tr className="border border-black">
                    <td className=" border border-black font-bold">
                      Service Type:
                    </td>
                    <td className=" border border-black">PAID</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-8">
            <div className="border border-black h-fit">
              <table className="table-auto border-collapse w-full">
                <thead>
                  <tr className="bg-gray-200 border border-black">
                    <th
                      className="text-center font-bold  border border-black"
                      colSpan={10}
                    >
                      Parts
                    </th>
                  </tr>
                  <tr className=" border-black bg-gray-200">
                    <th className="p-1 border border-black">Sr. No</th>
                    <th className="p-1 border border-black">Part No.</th>
                    <th className="p-1 border border-black">Description</th>
                    <th className="p-1 border border-black">Tax (%)</th>
                    <th className="p-1 border border-black">HSN</th>
                    <th className="p-1 border border-black">Quantity</th>
                    <th className="p-1 border border-black">Rate</th>
                    <th className="p-1 border border-black">Disc (%)</th>
                    <th className="p-1 border border-black">Disc Amount</th>
                    <th className="p-1 border border-black">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <>
                    {parts.map((part, index) => (
                      <tr key={index}>
                        <td className="p-1 border border-black">{index + 1}</td>
                        <td className="p-1 border border-black">
                          {part.partNumber}
                        </td>
                        <td className="p-1 border border-black">
                          {part.partName}
                        </td>
                        <td className="p-1 border border-black">{part.gst}</td>
                        <td className="p-1 border border-black">-</td>
                        <td className="p-1 border border-black">
                          {part.quantity}
                        </td>
                        <td className="p-1 border border-black">{part.mrp}</td>
                        <td className="p-1 border border-black">-</td>
                        <td className="p-1 border border-black">-</td>
                        <td className="p-1 border border-black">
                          {part.amount}
                        </td>
                      </tr>
                    ))}
                  </>

                  <tr className="bg-gray-200 border border-black">
                    <td
                      className="text-right font-medium border border-black"
                      colSpan={9}
                    >
                      Subtotal
                    </td>
                    <td className="text-right font-medium border border-black">
                      {jobCard?.partsTotalPostTax}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-8">
            <div className="border border-black h-fit">
              <table className="table-auto border-collapse w-full">
                <thead>
                  <tr className="bg-gray-200 border border-black">
                    <th
                      className="text-center font-bold  border border-black"
                      colSpan={10}
                    >
                      Labour
                    </th>
                  </tr>
                  <tr className=" border-black bg-gray-200">
                    <th className="p-1 border border-black">Sr. No</th>
                    {/* <th className="p-1 border border-black">Part No.</th> */}
                    <th className="p-1 border border-black">Description</th>
                    <th className="p-1 border border-black">Tax (%)</th>
                    <th className="p-1 border border-black">SAC</th>
                    <th className="p-1 border border-black">Quantity</th>
                    <th className="p-1 border border-black">Rate</th>
                    <th className="p-1 border border-black">Disc (%)</th>
                    <th className="p-1 border border-black">Disc Amount</th>
                    <th className="p-1 border border-black">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <>
                    {labour.map((work, index) => (
                      <tr key={index}>
                        <td className="p-1 border border-black">{index + 1}</td>
                        <td className="p-1 border border-black">
                          {work.labourName}
                        </td>
                        <td className="p-1 border border-black">{work.gst}</td>
                        <td className="p-1 border border-black">-</td>
                        <td className="p-1 border border-black">
                          {work.quantity}
                        </td>
                        <td className="p-1 border border-black">{work.mrp}</td>
                        <td className="p-1 border border-black">-</td>
                        <td className="p-1 border border-black">-</td>
                        <td className="p-1 border border-black">
                          {work.amount}
                        </td>
                      </tr>
                    ))}
                  </>

                  <tr className="bg-gray-200 border border-black">
                    <td
                      className="text-right font-medium border border-black"
                      colSpan={8}
                    >
                      Subtotal
                    </td>
                    <td className="text-right font-medium border border-black">
                      {jobCard?.labourTotalPostTax}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* <div className="mb-8">
            <div className="border border-black h-fit">
              <table className="table-auto border-collapse w-full">
                <thead>
                  <tr className=" border-black bg-gray-200">
                    <th className="p-1 border border-black">Type</th>
                    <th className="p-1 border border-black">Taxable Value</th>
                    <th className="p-1 border border-black">GST (%)</th>
                    <th className="p-1 border border-black">GST Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border border-black text-center">
                    <td className="border border-black">PARTS</td>
                    <td className="border border-black">
                      {jobCard?.partsTotalPreTax}
                    </td>

                    <td className="border border-black">{parts[0].gst}</td>

                    <td className="border border-black">
                      {jobCard?.partsTotalPostTax - jobCard?.partsTotalPreTax}
                    </td>
                  </tr>
                  <tr className="border border-black text-center">
                    <td className="border border-black">LABOUR</td>
                    <td className="border border-black">
                      {jobCard?.labourTotalPreTax}
                    </td>

                    <td className="border border-black">{labour[0].gst}</td>

                    <td className="border border-black">
                      {jobCard?.labourTotalPostTax - jobCard?.labourTotalPreTax}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div> */}

          <div className="flex flex-row mb-8 justify-between">
            <div className="border border-black h-fit w-[45%]">
              <table className="table-auto border-collapse w-full">
                <thead>
                  <tr className="bg-gray-200 border border-black">
                    <th
                      className="text-center font-bold  border border-black"
                      colSpan={10}
                    >
                      Observations and Remarks
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border border-black">
                    <td className="text-left font-normal border border-black">
                      -
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="border border-black h-fit w-[45%]">
              <table className="table-auto border-collapse w-full">
                <tbody>
                  <tr className="border border-black">
                    <td className=" border bg-gray-200 border-black font-bold">
                      Total Taxable Value:
                    </td>
                    <td className=" border border-black px-3">
                      {jobCard.partsTotalPreTax + jobCard.labourTotalPreTax}
                    </td>
                  </tr>
                  <tr className="border border-black">
                    <td className=" border bg-gray-200 border-black font-bold">
                      Total GST Amount:
                    </td>
                    <td className=" border border-black px-3">
                      {Math.round(
                        (jobCard.partsTotalPostTax -
                          jobCard.partsTotalPreTax +
                          (jobCard.labourTotalPostTax -
                            jobCard.labourTotalPreTax)) *
                          100
                      ) / 100}
                    </td>
                  </tr>
                  <tr className="border border-black">
                    <td className=" border bg-gray-200 border-black font-bold">
                      TOTAL:
                    </td>
                    <td className=" border border-black px-3">
                      {Math.round(
                        jobCard.partsTotalPostTax +
                          jobCard.labourTotalPostTax * 100
                      ) / 100}
                    </td>
                  </tr>
                  <tr className="border border-black">
                    <td className=" border bg-gray-200 border-black font-bold">
                      TOTAL (rounded off):
                    </td>
                    <td className=" border border-black px-3">
                      {Math.round(
                        jobCard.partsTotalPostTax + jobCard.labourTotalPostTax
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
