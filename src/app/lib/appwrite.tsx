import { Client, Account, Databases, Query, ID } from "appwrite";
import dotenv from 'dotenv';

dotenv.config()

const FIELDS = {
  CAR_STATUS: "carStatus",
  JOB_CARD_STATUS: "jobCardStatus",
};

export const config = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
  carsCollectionId: process.env.NEXT_PUBLIC_APPWRITE_CARS_COLLECTION_ID!,
  tempCarsCollectionId: process.env.NEXT_PUBLIC_APPWRITE_TEMP_CARS_COLLECTION_ID!,
  jobCardsCollectionId: process.env.NEXT_PUBLIC_APPWRITE_JOB_CARDS_COLLECTION_ID!,
  partsCollectionId: process.env.NEXT_PUBLIC_APPWRITE_PARTS_COLLECTION_ID!,
  labourCollectionId: process.env.NEXT_PUBLIC_APPWRITE_LABOUR_COLLECTION_ID!,
};

export let client: any = new Client().setEndpoint(config.endpoint).setProject(config.projectId);
export let account: any = new Account(client);
export let databases: any = new Databases(client);
//.setPlatform(config.platform);

export const loginUser = async (email: string, password: string) => {
  try {
    const sessionDetails = await account.createEmailPasswordSession(
      email,
      password
    );
    const userDetails = await account.get();
    return { userDetails, sessionDetails };
  } catch (error: any) {
    return handleError(error);
  }
};

export const listSessions = async () => {
  try {
    const sessions = await account.listSessions();
    return sessions;
  } catch (error: any) {
    return handleError(error);
  }
};

export const logoutUser = async () => {
  try {
    const result = await account.deleteSessions();
    return result;
  } catch (error: any) {
    return handleError(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const user = await account.get();
    // console.log("This is the USER");
    return user;
  } catch (error: any) {
    return handleError(error);
  }
};

export const createCar = async (
  carNumber: String,
  carMake: String,
  carModel: String,
  // customerName: String,
  // customerPhone: String,
  purposeOfVisit: String,
  location: String
) => {
  try {
    let carsResult = await databases.createDocument(
      config.databaseId,
      config.carsCollectionId,
      ID.unique(),
      { carNumber, carMake, carModel, location, purposeOfVisit }
    );
    // console.log("The created Car is - ", result);
    return carsResult;
  } catch (error: any) {
    return handleError(error);
  }
};

export const getAllTempCars = async (statuses: number[]) => {
  // console.log("Hitting Backend");
  let finalQuery: any[] = buildStatusQuery(statuses, FIELDS.CAR_STATUS);
  try {
    let result = await listDocuments(config.tempCarsCollectionId, finalQuery);
    return result;
  } catch (error: any) {
    return handleError(error);
  }
};


export const createTempCar = async (
  carNumber: String,
  carMake: String,
  carModel: String,
  purposeOfVisit: String,
  location: String,
  carsTableId: string
) => {
  try {
    let carStatus = 0;
    let carsResult = await databases.createDocument(
      config.databaseId,
      config.tempCarsCollectionId,
      ID.unique(),
      {
        carNumber,
        carMake,
        carModel,
        location,
        purposeOfVisit,
        carStatus,
        carsTableId,
      }
    );
    // console.log("The created Car is - ", result);
    return carsResult;
  } catch (error: any) {
    return handleError(error);
  }
};


export const searchTempCar = async (searchTerm: string, statuses: number[]) => {
  let finalQuery: any[] = buildStatusQuery(statuses, FIELDS.CAR_STATUS);
  try {
    let result = await listDocuments(config.tempCarsCollectionId, [Query.contains("carNumber", [searchTerm]), finalQuery]);
    return result;
  } catch (error: any) {
    return handleError(error);
  }
};

export const deleteTempCar = async (carId: string) => {
  try {
    let result = await databases.deleteDocument(
      config.databaseId,
      config.tempCarsCollectionId,
      carId
    );
    // console.log("THE SEARCHED CARS -", result);
    return result;
  } catch (error: any) {
    return handleError(error);
  }
};

export const searchCarHistory = async (searchTerm: string) => {
  try {
    let result = await listDocuments(config.carsCollectionId, [Query.contains("carNumber", [searchTerm])]);
    // console.log("THE SEARCHED CARS -", result);
    return result;
  } catch (error: any) {
    return handleError(error);
  }
};

export const createJobCard = async (
  carId: string,
  carNumber: string,
  diagnosis: string[],
  customerName: string,
  customerPhone: string,
  sendToPartsManager: boolean,
  carsTableId: string
) => {
  try {
    let result = await databases.createDocument(
      config.databaseId,
      config.jobCardsCollectionId,
      ID.unique(),
      {
        carId,
        diagnosis,
        sendToPartsManager,
        carNumber,
        jobCardStatus: 0,
        customerName,
        customerPhone,
      }
    );

    await databases.updateDocument(
      config.databaseId,
      config.tempCarsCollectionId, // collectionId
      carId, // documentId
      { carStatus: 1, jobCardId: result["$id"] } // data (optional)
    );

    const carHistory = await databases.getDocument(
      config.databaseId,
      config.carsCollectionId, // collectionId
      carsTableId, // documentId
      [] // queries (optional)
    );

    console.log("SELECTED CAR HISTORY - ", carHistory);

    let tempJobCards = carHistory.allJobCards;

    tempJobCards.push(result["$id"]);

    // if(selectedCarDetails.documents[0][])

    await databases.updateDocument(
      config.databaseId,
      config.carsCollectionId,
      carsTableId,
      { allJobCards: tempJobCards, customerName, customerPhone }
    );

    console.log("The created Job Card is - ", result);
    return result;
  } catch (error: any) {
    return handleError(error);
  }
};
export const getAllJobCards = async (statuses?: number[]) => {
  // console.log("Hitting Backend");
  let finalQuery: any[] = statuses ? buildStatusQuery(statuses, FIELDS.JOB_CARD_STATUS): [];
  try {
    let result = await listDocuments(config.jobCardsCollectionId, finalQuery);
    return result;
  } catch (error: any) {
    return handleError(error);
  }
};

export const getJobCardById = async (id: string) => {
  // console.log("Hitting Backend");
  try {
    let result = await databases.getDocument(
      config.databaseId,
      config.jobCardsCollectionId,
      id
    );
    return result;
  } catch (error: any) {
    return handleError(error);
  }
};

export const updateJobCardById = async (
  id: string,
  parts?: string[],
  labour?: string[],
  jobCardStatus?: number
) => {
  try {
    await databases.updateDocument(
      config.databaseId,
      config.jobCardsCollectionId, // collectionId
      id, // documentId
      { parts, labour, jobCardStatus } // data (optional)
    );
    return true;
  } catch (error: any) {
    return handleError(error);
  }
};

export const getTempCarById = async (id: string) => {
  // console.log("Hitting Backend");
  try {
    let result = await databases.getDocument(
      config.databaseId,
      config.tempCarsCollectionId,
      id
    );
    return result;
  } catch (error: any) {
    return handleError(error);
  }
};

export const getAllParts = async () => {
  // console.log("Hitting Backend");
  try {
    let result = await listDocuments(config.partsCollectionId);
    return result;
  } catch (error: any) {
    return handleError(error);
  }
};


export const getAllLabour = async () => {
  // console.log("Hitting Backend");
  try {
    let result = await listDocuments(config.labourCollectionId);
    return result;
  } catch (error: any) {
    return handleError(error);
  }
};


const handleError = (error: any) => {
  console.error("Error: ", error.message);
  return null;
};

const listDocuments = async (collectionId: string, query: any[] = []) => {
  return databases.listDocuments(config.databaseId, collectionId, query);
};

const buildStatusQuery = (statuses: number[], field: string) :any[] =>  {
  return statuses.length > 1 
    ? [Query.or(statuses.map((stat: number) => Query.equal(field, [stat])))]
    : [Query.equal(field, statuses[0])];
};
