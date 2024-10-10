import { Client, Account, Databases } from "appwrite";
import dotenv from 'dotenv';

dotenv.config()

export const config = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
  collections: {
    cars: process.env.NEXT_PUBLIC_APPWRITE_CARS_COLLECTION_ID!,
    tempCars: process.env.NEXT_PUBLIC_APPWRITE_TEMP_CARS_COLLECTION_ID!,
    jobCards: process.env.NEXT_PUBLIC_APPWRITE_JOB_CARDS_COLLECTION_ID!,
    parts: process.env.NEXT_PUBLIC_APPWRITE_PARTS_COLLECTION_ID!,
    labour: process.env.NEXT_PUBLIC_APPWRITE_LABOUR_COLLECTION_ID!,
  },
};

// Initialize Appwrite client
export const client = new Client().setEndpoint(config.endpoint).setProject(config.projectId);
export const account = new Account(client);
export const databases = new Databases(client);