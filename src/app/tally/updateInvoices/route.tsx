import { getAllTaxInvoicesAfterDateTime, getJobCardById } from "@/lib/appwrite";
import { Invoice } from "@/lib/definitions";
import { stringToObj } from "@/lib/helper";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  //   console.log("BODY", request.body);
  try {
    const dateTimeStamp = await request.json();

    const result = await getAllTaxInvoicesAfterDateTime(dateTimeStamp.last_sync_time);

    const newInvoices = result.documents;

    const updatedNewInvoices = await Promise.all(
      newInvoices.map(async (invoice: Invoice, index: number) => {
        let result = await getJobCardById(invoice.jobCardId);
        result.parts = stringToObj(result.parts);
        result.labour = stringToObj(result.labour);
        result.taxes = stringToObj(result.taxes);

        invoice.jobCardDetails = result;

        return invoice;
      })
    );

    return NextResponse.json(updatedNewInvoices, { status: 201 });
    
  } catch (error) {
    console.log("Failed");
    console.log(error);

    return NextResponse.json({
      message: "Failed",
      status: false,
    });
  }
}
