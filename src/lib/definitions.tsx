export interface Car {
  carNumber: string;
  carMake: string;
  carModel: string;
  location: string;
  purposeOfVisitAndAdvisors: string[];
  jobCardId: string;
  carStatus: number;
  carsTableId: string;
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $databaseId: string;
  $collectionId: string;
}

export interface Part {
  partName: string;
  partNumber: string;
  hsn: string;
  category: string;
  mrp: number;
  gst: number;
  cgst: number;
  sgst: number;
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: any[];
  $databaseId: string;
  $collectionId: string;
}

// Define the structure for the JobCard object
export interface JobCard {
  carId: string;
  diagnosis: string[];
  sendToPartsManager: boolean;
  carNumber: string;
  jobCardStatus: number;
  customerName: string;
  customerPhone: string;
  parts: string[];
  labour: string[];
  partsTotalPreTax: number;
  partsTotalPostTax: number;
  labourTotalPreTax: number;
  labourTotalPostTax: number;
  subTotal: number;
  discountAmt: number;
  amount: number;
  jobCardNumber: number;
  insuranceDetails: string;
  purposeOfVisit: string;
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $databaseId: string;
  $collectionId: string;
}

export type CurrentPart = {
  partId: string;
  partName: string;
  partNumber: string;
  mrp: number;
  gst: number;
  hsn: string;
  cgst: number;
  sgst: number;
  quantity: number;
  subTotal: number;
  cgstAmt: number;
  sgstAmt: number;
  totalTax: number;
  amount: number;
  discountPercentage?: number;
  discountAmt?: number;
  insurancePercentage?: number;
  insuranceAmt?: number;
  customerAmt?: number;
};

export interface Labour {
  labourName: string;
  labourCode: string;
  hsn: string;
  category: string;
  mrp: number;
  gst: number;
  cgst: number;
  sgst: number;
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: any[];
  $databaseId: string;
  $collectionId: string;
}

export type CurrentLabour = {
  labourId: string;
  labourName: string;
  labourCode: string;
  mrp: number;
  hsn: string;
  gst: number;
  cgst: number;
  sgst: number;
  quantity: number;
  subTotal: number;
  cgstAmt: number;
  sgstAmt: number;
  totalTax: number;
  amount: number;
  discountPercentage?: number;
  discountAmt?: number;
  insurancePercentage?: number;
  insuranceAmt?: number;
  customerAmt?: number;
};

export type TempCar = {
  carNumber: string;
  carMake: string;
  carModel: string;
  location: string;
  purposeOfVisitAndAdvisors: string[];
  jobCardId: null | number;
  allJobCardIds: string[];
  carStatus: number;
  carsTableId: null | number;
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $databaseId: string;
  $collectionId: string;
};

export type ImageObj = {
  imageType: string;
  thumbnailURL: string;
  imageURL: string;
};

export type Target = {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  name: string;
  userId: string;
  providerId: string | null;
  providerType: string;
  identifier: string;
};

export type UserType = {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  name: string;
  registration: string;
  status: boolean;
  labels: string[];
  passwordUpdate: string;
  email: string;
  phone: string;
  emailVerification: boolean;
  phoneVerification: boolean;
  mfa: boolean;
  prefs: Record<string, unknown>;
  targets: Target[];
  accessedAt: string;
};

export interface Invoice {
  invoiceUrl: string;
  jobCardId: string;
  carNumber: string;
  invoiceType: string;
  invoiceNumber: number;
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[]; // Assuming it's an array of strings, adjust if different
  $databaseId: string;
  $collectionId: string;
}

export interface TaxObj {
  taxType: string;
  taxRate: number;
  taxName: string;
  taxAmt: number;
}
