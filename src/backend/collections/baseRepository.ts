import { databases, config } from '../client/appwriteClient';
import { ID } from 'appwrite';

export class BaseRepository {
  private collectionId: string;
  private databaseId: string = config.databaseId;

  constructor(collectionId: string) {
    this.collectionId = collectionId;
  }

  // Create a document
  async createDocument(data: any): Promise<any> {
    try {
      return await databases.createDocument(
        this.databaseId, 
        this.collectionId, 
        ID.unique(), 
        data
    );
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  // Get a document by ID
  async getDocumentById(documentId: string): Promise<any> {
    try {
      return await databases.getDocument(
        this.databaseId, 
        this.collectionId, 
        documentId
    );
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  // Update a document by ID
  async updateDocumentById(documentId: string, data: any): Promise<any> {
    try {
      return await databases.updateDocument(
        this.databaseId, 
        this.collectionId, 
        documentId, 
        data
    );
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  // List documents with optional queries
  async listDocuments(query: any[] = []): Promise<any> {
    try {
      return await databases.listDocuments(
        this.databaseId, 
        this.collectionId, 
        query
    );
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  // Delete a document by ID
  async deleteDocumentById(documentId: string): Promise<any> {
    try {
      return await databases.deleteDocument(
        this.databaseId, 
        this.collectionId, 
        documentId
    );
    } catch (error: any) {
      this.handleError(error);
    }
  }

  // Error handler
  private handleError(error: any): any {
    console.error("Appwrite Error:", error.message);
    return { error: error.message };
  }
}
