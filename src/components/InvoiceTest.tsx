import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { CurrentLabour, CurrentPart } from "@/lib/definitions";
import { convertStringsToArray } from "@/lib/helper";

Font.register({
  family: "Open Sans",
  fonts: [
    {
      src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf",
      fontWeight: 600,
    },
  ],
});

// Stylesheet for react-pdf
const styles = StyleSheet.create({
  page: {
    display: "flex",
    padding: "20px",
    marginTop: "20px",
  },
  headingRow: {
    width: "100%",
    marginBottom: 20,
  },
  heading: {
    fontSize: 20,
    fontFamily: "Open Sans",
    fontWeight: "black",
    textAlign: "center",
  },
  addressRow: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 30,
  },
  addressBlock: {
    display: "flex",
    flexDirection: "column",
    width: "40%",
  },
  workShopName: {
    fontSize: 12,
    fontFamily: "Open Sans",
    fontWeight: "black",
    alignSelf: "flex-end",
  },
  workShopAddress: {
    fontSize: 12,
    fontFamily: "Open Sans",
    fontWeight: "thin",
    alignSelf: "flex-end",
  },
  workShopGST: {
    fontSize: 12,
    fontFamily: "Open Sans",
    fontWeight: "black",
    alignSelf: "flex-end",
  },
  invoiceTypeRow: {
    width: "100%",
    marginBottom: 10,
  },
  invoiceType: {
    fontSize: 14,
    fontFamily: "Open Sans",
    fontWeight: "black",
    textAlign: "center",
  },
  detailTablesRow: {
    width: "100%",
    marginBottom: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  detailTable: {
    width: 180,
    height: "auto",
    // backgroundColor: "#E11D48",
    borderWidth: 1.5,
    borderColor: "#000000",
  },
  tableTitleRow: {
    width: "100%",
    backgroundColor: "#D1D5DB",
    textAlign: "center",
  },
  tableTitle: {
    fontSize: 11,
    fontFamily: "Open Sans",
    fontWeight: "black",
    padding: 2,
    borderBottomWidth: 0.5,
    borderBottomColor: "#000000",
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
  },
  tableCell: {
    borderWidth: 0.5,
    borderColor: "#000000",
    width: "50%",
  },
  tableData: {
    fontSize: 11,
    padding: 5,
  },
  tableDataEmphasized: {
    fontFamily: "Open Sans",
    fontWeight: "black",
  },
  partsTable: {
    width: "100%",
    height: "auto",
    borderWidth: 1.5,
    borderColor: "#000000",
    marginBottom: 20,
  },
  tableHeaderRow: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#D1D5DB",
    width: "100%",
    justifyContent: "space-evenly",
  },
  tableHeader: {
    borderWidth: 0.5,
    borderColor: "#000000",
    width: "100%",
    textAlign: "center",
    fontSize: 8,
  },
  tableFooterRow: {
    backgroundColor: "#D1D5DB",
  },
  tableEmptyCell: {
    width: "50%",
  },
});

export const InvoicePDF = ({
  jobCard,
  parts,
  labour,
  logo,
  car,
  currentDate,
  purposeOfVisitAndAdvisors
}: any) => (
  
  <Document>
    {jobCard && car && parts && labour && (
      <Page size="A4" style={styles.page}>
        <View style={styles.headingRow}>
          <Text style={styles.heading}>T3 ALL CAR SERVICE</Text>
        </View>
        <View style={styles.addressRow}>
          <Image style={styles.logo} src={logo} />
          <View style={styles.addressBlock}>
            <Text style={styles.workShopName}>CHANMUNDA MOTORS PVT. LTD.</Text>
            <Text style={styles.workShopAddress}>
              21/1-1, RAM BAUGH, OFF S V ROAD, <br />
              BORIVALI WEST, MUMBAI SUBURBAN
            </Text>
            <Text style={styles.workShopGST}>GST NO: 27AAACC1903H1Z4</Text>
          </View>
        </View>
        <View style={styles.invoiceTypeRow}>
          <Text style={styles.invoiceType}>Tax Invoice</Text>
        </View>
        <View style={styles.detailTablesRow}>
          <View style={styles.detailTable}>
            <View style={styles.tableTitleRow}>
              <Text style={styles.tableTitle}>Customer Details</Text>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={[styles.tableData, styles.tableDataEmphasized]}>
                  Name:
                </Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableData}>{jobCard.customerName}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={[styles.tableData, styles.tableDataEmphasized]}>
                  Mobile:
                </Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableData}> {jobCard?.customerPhone}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={[styles.tableData, styles.tableDataEmphasized]}>
                  Address:
                </Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableData}>
                  {" "}
                  {jobCard?.customerAddress}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.detailTable}>
            <View style={styles.tableTitleRow}>
              <Text style={styles.tableTitle}>Vehicle Details</Text>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={[styles.tableData, styles.tableDataEmphasized]}>
                  Registration:
                </Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableData}> {jobCard?.carNumber}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={[styles.tableData, styles.tableDataEmphasized]}>
                  Make:
                </Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableData}> {car?.carMake}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={[styles.tableData, styles.tableDataEmphasized]}>
                  Model:
                </Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableData}>{car?.carModel}</Text>
              </View>
            </View>
          </View>
          <View style={styles.detailTable}>
            <View style={styles.tableTitleRow}>
              <Text style={styles.tableTitle}>Invoice Details</Text>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={[styles.tableData, styles.tableDataEmphasized]}>
                  Invoice No:
                </Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableData}>SER/5171</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={[styles.tableData, styles.tableDataEmphasized]}>
                  Invoice Date:
                </Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableData}>
                  {currentDate.toLocaleDateString()}
                </Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={[styles.tableData, styles.tableDataEmphasized]}>
                  Job Card No:
                </Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableData}>{jobCard.jobCardNumber}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={[styles.tableData, styles.tableDataEmphasized]}>
                  Service Type:
                </Text>
              </View>
              <View style={styles.tableCell}>
                {purposeOfVisitAndAdvisors.map((visit: any, index: any) => (
                  <Text>{visit.description}</Text>
                ))}
                <Text style={styles.tableData}>{car.purposeOfVisit}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.partsTable}>
          <View style={styles.tableTitleRow}>
            <Text style={styles.tableTitle}>Parts</Text>
          </View>
          <View style={styles.tableHeaderRow}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableDataEmphasized, styles.tableData]}>
                Sr. No.
              </Text>
            </View>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableDataEmphasized, styles.tableData]}>
                Part No.
              </Text>
            </View>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableDataEmphasized, styles.tableData]}>
                Name
              </Text>
            </View>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableDataEmphasized, styles.tableData]}>
                Tax %
              </Text>
            </View>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableDataEmphasized, styles.tableData]}>
                HSN
              </Text>
            </View>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableDataEmphasized, styles.tableData]}>
                Quantity
              </Text>
            </View>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableDataEmphasized, styles.tableData]}>
                MRP
              </Text>
            </View>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableDataEmphasized, styles.tableData]}>
                Disc %
              </Text>
            </View>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableDataEmphasized, styles.tableData]}>
                Amount
              </Text>
            </View>
          </View>
          {parts.map((part: CurrentPart, index: number) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={styles.tableData}>{index + 1}.</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableData}>{part.partNumber}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableData}>{part.partName}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableData}>{part.gst}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableData}>{part.hsn}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableData}>{part.quantity}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableData}>{part.mrp}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableData}>{part.discount}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableData}>{part.amount}</Text>
              </View>
            </View>
          ))}
          <View style={[styles.tableRow, styles.tableFooterRow]}>
            <View style={styles.tableEmptyCell}>
              <Text style={styles.tableData}></Text>
            </View>
            <View style={styles.tableEmptyCell}>
              <Text style={styles.tableData}></Text>
            </View>
            <View style={styles.tableEmptyCell}>
              <Text style={styles.tableData}></Text>
            </View>
            <View style={styles.tableEmptyCell}>
              <Text style={styles.tableData}></Text>
            </View>
            <View style={styles.tableEmptyCell}>
              <Text style={styles.tableData}></Text>
            </View>
            <View style={styles.tableEmptyCell}>
              <Text style={styles.tableData}></Text>
            </View>
            <View style={styles.tableEmptyCell}>
              <Text style={styles.tableData}></Text>
            </View>
            <View style={styles.tableEmptyCell}>
              <Text style={styles.tableData}>SubTotal</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.tableData}>{jobCard.partsTotalPostTax}</Text>
            </View>
          </View>
        </View>
        <View style={styles.partsTable}>
          <View style={styles.tableTitleRow}>
            <Text style={styles.tableTitle}>Labour</Text>
          </View>
          <View style={styles.tableHeaderRow}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableDataEmphasized, styles.tableData]}>
                Sr. No.
              </Text>
            </View>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableDataEmphasized, styles.tableData]}>
                Labour Code
              </Text>
            </View>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableDataEmphasized, styles.tableData]}>
                Name
              </Text>
            </View>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableDataEmphasized, styles.tableData]}>
                Tax %
              </Text>
            </View>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableDataEmphasized, styles.tableData]}>
                HSN
              </Text>
            </View>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableDataEmphasized, styles.tableData]}>
                Quantity
              </Text>
            </View>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableDataEmphasized, styles.tableData]}>
                MRP
              </Text>
            </View>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableDataEmphasized, styles.tableData]}>
                Disc %
              </Text>
            </View>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableDataEmphasized, styles.tableData]}>
                Amount
              </Text>
            </View>
          </View>
          {labour.map((work: CurrentLabour, index: number) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={styles.tableData}>{index + 1}.</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableData}>{work.labourCode}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableData}>{work.labourName}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableData}>{work.gst}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableData}>{work.labourCode}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableData}>{work.quantity}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableData}>{work.mrp}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableData}>-</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableData}>{work.amount}</Text>
              </View>
            </View>
          ))}
          <View style={[styles.tableRow, styles.tableFooterRow]}>
            <View style={styles.tableEmptyCell}>
              <Text style={styles.tableData}></Text>
            </View>
            <View style={styles.tableEmptyCell}>
              <Text style={styles.tableData}></Text>
            </View>
            <View style={styles.tableEmptyCell}>
              <Text style={styles.tableData}></Text>
            </View>
            <View style={styles.tableEmptyCell}>
              <Text style={styles.tableData}></Text>
            </View>
            <View style={styles.tableEmptyCell}>
              <Text style={styles.tableData}></Text>
            </View>
            <View style={styles.tableEmptyCell}>
              <Text style={styles.tableData}></Text>
            </View>
            <View style={styles.tableEmptyCell}>
              <Text style={styles.tableData}></Text>
            </View>
            <View style={styles.tableEmptyCell}>
              <Text style={styles.tableData}>SubTotal</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.tableData}>{jobCard.labourTotalPostTax}</Text>
            </View>
          </View>
        </View>
      </Page>
    )}
  </Document>
);
