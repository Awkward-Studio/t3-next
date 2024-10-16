export interface Car {
  carNumber: string;
  carMake: string;
  carModel: string;
  location: string;
  purposeOfVisit: string;
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
  jobCardNumber: number;
  insuranceDetails: string;
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $databaseId: string;
  $collectionId: string;
}

export type CurrentPart = {
  $id: string;
  partName: string;
  partNumber: string;
  mrp: number;
  gst: number;
  hsn: string;
  quantity: number;
  amount: number;
  discount?: number;
  insurance?: number;
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
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: any[];
  $databaseId: string;
  $collectionId: string;
}

export type CurrentLabour = {
  $id: string;
  labourName: string;
  labourCode: string;
  mrp: number;
  gst: number;
  quantity: number;
  amount: number;
};

export type TempCar = {
  carNumber: string;
  carMake: string;
  carModel: string;
  location: string;
  purposeOfVisit: string;
  jobCardId: null | number;
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
