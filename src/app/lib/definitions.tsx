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
  quantity: number;
  amount: number;
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
