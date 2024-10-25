import { Client, Account, Databases, Query, ID, Storage } from "appwrite";
import { getCookie } from "cookies-next";
import ImageKit from "imagekit";
import { convertStringsToArray, convertToStrings, purposeOfVisits } from "./helper";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  // platform: "com.index.t3",
  projectId: "66b10a0100095b4634e4",
  databaseId: "66b10c670021dc021477",
  carsCollectionId: "66deb8920021a5819b2c",
  tempCarsCollectionId: "66e933af0022ed863b96",
  jobCardsCollectionId: "66e80a830013e7a81f31",
  partsCollectionId: "66f6ce58000446f6aeaf",
  labourCollectionId: "66fa5dc6003941f79697",
  carImagesBucketId: "67053962002be8598a04",
};

export let client: any;
export let account: any;
export let databases: any;
export let storage: any;

client = new Client();
client.setEndpoint(config.endpoint).setProject(config.projectId);
//   .setPlatform(config.platform);

account = new Account(client);
databases = new Databases(client);
storage = new Storage(client);

const imagekit = new ImageKit({
  publicKey: "public_YxeQGi/zYRicR5GdhQu7UwOMAYg=",
  privateKey: "private_pPkQ38mNRgbbpt9JElST4HPGQfw=",
  urlEndpoint: "https://ik.imagekit.io/ztq7tvia1",
});

export const loginUser = async (email: any, password: any) => {
  try {
    const sessionDetails = await account.createEmailPasswordSession(
      email,
      password
    );
    const userDetails = await account.get();

    return { userDetails, sessionDetails };
  } catch (error: any) {
    console.log("THIS IS THE ERROR", error.message);
    return null;
  }
};

export const listSessions = async () => {
  try {
    const sessions = await account.listSessions();
    return sessions;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

export const logoutUser = async () => {
  try {
    const result = await account.deleteSessions();
    return result;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

export const getCurrentUser = async () => {
  try {
    const user = await account.get();
    // console.log("This is the USER");
    return user;
  } catch (error: any) {
    return null;
  }
};

export const getAllTempCars = async (statuses?: number[]) => {
  // console.log("Hitting Backend");
  let finalQuery: any[] = [Query.orderDesc("$createdAt")];
  if (statuses) {
    if (statuses.length > 1) {
      let queries: any = [];
      statuses.map((stat: number) => {
        queries.push(Query.equal("carStatus", [stat]));
      });
      finalQuery = [...finalQuery, Query.or(queries)];
    } else {
      finalQuery = [...finalQuery, Query.equal("carStatus", statuses[0])];
    }
  }
  try {
    let result = await databases.listDocuments(
      config.databaseId,
      config.tempCarsCollectionId,
      finalQuery
    );
    return result;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

export const createCar = async (
  carNumber: String,
  carMake: String,
  carModel: String,
  purposeOfVisit: String,
  purposeOfVisitAndAdvisors: String[],
  location?: String
) => {
  try {
    let carsResult = await databases.createDocument(
      config.databaseId,
      config.carsCollectionId,
      ID.unique(),
      { carNumber, carMake, carModel, purposeOfVisit, location, purposeOfVisitAndAdvisors }
    );
    // console.log("The created Car is - ", result);
    return carsResult;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

export const createTempCar = async (
  carNumber: String,
  carMake: String,
  carModel: String,
  purposeOfVisit: String,
  purposeOfVisitAndAdvisors: String[],
  carsTableId: string,
  location?: String,
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
        purposeOfVisitAndAdvisors,
      }
    );
    // console.log("The created Car is - ", result);
    return carsResult;
  } catch (error: any) {
    console.log("THIS IS ERROR - ", error.message);
    return null;
  }
};

export const createJobCard = async (
  carId: string,
  carNumber: string,
  images: string[],
  carOdometer: string,
  carFuel: string,
  diagnosis: string[],
  customerName: string,
  customerPhone: string,
  customerAddress: string,
  sendToPartsManager: boolean,
  carsTableId: string,
  jobCardNumber: number
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
        jobCardNumber,
        images,
        carFuel,
        carOdometer,
        customerAddress,
      }
    );

    // To update the tempcar status
    const tempCar = await getTempCarById(carId);
    if (!tempCar) {
      console.log("Car not found");
      return null;
    }

    const token = getCookie("user");
    const parsedToken = JSON.parse(String(token));
    const advisorEmail = parsedToken.email;

    // Check if the user email matches an advisor and update `open` field if it exists
    const purposeOfVisitAndAdvisors = convertStringsToArray(tempCar.purposeOfVisitAndAdvisors);
    const updatedPov = purposeOfVisitAndAdvisors.map((pov: any) => {
      if (pov.advisorEmail === advisorEmail && pov.open === false) {
        return { ...pov, open: true }; // Set `open` to true if it matches the advisor email
      }
      return pov;
    });
    const updatedPurposeOfVisitAndAdvisors = convertToStrings(updatedPov);
    await databases.updateDocument(
      config.databaseId,
      config.tempCarsCollectionId, // collectionId
      carId, // documentId
      { carStatus: 1, jobCardId: result["$id"], purposeOfVisitAndAdvisors: updatedPurposeOfVisitAndAdvisors } // data (optional)
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
      {
        allJobCards: tempJobCards,
        customerName,
        customerPhone,
        customerAddress,
      }
    );

    console.log("The created Job Card is - ", result);
    return result;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

export const searchTempCar = async (
  searchTerm: string,
  statuses?: number[]
) => {
  let finalQuery: any[] = [];
  if (statuses) {
    if (statuses.length > 1) {
      let queries: any = [];
      statuses.map((stat: number) => {
        queries.push(Query.equal("carStatus", [stat]));
      });
      finalQuery = [Query.or(queries)];
    } else {
      finalQuery = [Query.equal("carStatus", statuses[0])];
    }
  }
  try {
    let result = await databases.listDocuments(
      config.databaseId,
      config.tempCarsCollectionId,
      [Query.contains("carNumber", [searchTerm]), finalQuery]
    );
    // console.log("THE SEARCHED CARS -", result);
    return result;
  } catch (error: any) {
    console.log(error.message);
    return null;
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
    console.log(error.message);
    return null;
  }
};

export const searchCarHistory = async (searchTerm: string) => {
  try {
    let result = await databases.listDocuments(
      config.databaseId,
      config.carsCollectionId,
      [Query.contains("carNumber", [searchTerm])]
    );
    // console.log("THE SEARCHED CARS -", result);
    return result;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

export const getAllJobCards = async (statuses?: number[]) => {
  // console.log("Hitting Backend");
  let finalQuery: any[] = [Query.orderDesc("$createdAt")];
  if (statuses) {
    if (statuses.length > 1) {
      let queries: any = [];
      statuses.map((stat: number) => {
        queries.push(Query.equal("jobCardStatus", [stat]));
      });
      finalQuery = [...finalQuery, Query.or(queries)];
    } else {
      finalQuery = [...finalQuery, Query.equal("jobCardStatus", statuses[0])];
    }
  }

  try {
    let result = await databases.listDocuments(
      config.databaseId,
      config.jobCardsCollectionId,
      finalQuery
    );
    return result;
  } catch (error: any) {
    console.log(error.message);
    return null;
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
    console.log(error.message);
    return null;
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
    console.log(error.message);
    return null;
  }
};

export const getAllParts = async () => {
  // console.log("Hitting Backend");

  try {
    let result = await databases.listDocuments(
      config.databaseId,
      config.partsCollectionId,
      []
    );
    return result;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

export const updateJobCardById = async (
  id: string,
  parts?: string[],
  labour?: string[],
  jobCardStatus?: number,
  partsTotalPreTax?: number,
  partsTotalPostTax?: number,
  labourTotalPreTax?: number,
  labourTotalPostTax?: number,
  insuranceDetails?: string
) => {
  if (parts) {
  }
  try {
    await databases.updateDocument(
      config.databaseId,
      config.jobCardsCollectionId, // collectionId
      id, // documentId
      {
        // insuranceDetails,
        parts,
        labour,
        jobCardStatus,
        partsTotalPreTax,
        partsTotalPostTax,
        labourTotalPreTax,
        labourTotalPostTax,
        insuranceDetails,
      } // data (optional)
    );
    return true;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

export const getAllLabour = async () => {
  // console.log("Hitting Backend");

  try {
    let result = await databases.listDocuments(
      config.databaseId,
      config.labourCollectionId,
      []
    );
    return result;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

export const uploadCarImage = async (file: any) => {
  // console.log("Hitting Backend");
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let uniqueStr = "";

  for (let i = 0; i <= 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    uniqueStr += characters.charAt(randomIndex);
  }

  return new Promise((resolve, reject) => {
    try {
      imagekit.upload(
        {
          file: file, //required
          fileName: uniqueStr + ".jpg", //required
        },
        (err, result) => {
          if (err) {
            console.error("Upload error:", err);
            reject(err);
          }
          console.log("Uploaded file result:", result);
          // setUploadUrl(result.url); // Set the URL of the uploaded image
          resolve(result);
        }
      );
    } catch (error: any) {
      console.log(error.message);
      reject(null);
    }
  });
};

export const updateJobCardInsuranceDetails = async (
  id: string,
  insuranceDetails?: string
) => {
  try {
    await databases.updateDocument(
      config.databaseId,
      config.jobCardsCollectionId, // collectionId
      id, // documentId
      {
        // insuranceDetails,

        insuranceDetails,
      } // data (optional)
    );
    return true;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};
