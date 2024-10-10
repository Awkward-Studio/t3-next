import { config } from '../../client/appwriteClient';
import { BaseRepository } from '../baseRepository';

export class LabourService extends BaseRepository {
  constructor() {
    super(config.collections.labour); 
  }

  // Create a new labour entry
  async createLabour(data: any): Promise<any> {
    return this.createDocument(data);
  }

  // Get a labour by ID
  async getLabourById(labourId: string): Promise<any> {
    return this.getDocumentById(labourId);
  }

  // Update a labour by ID
  async updateLabourById(labourId: string, data: any): Promise<any> {
    return this.updateDocumentById(labourId, data);
  }

  // List all labours
  async listLabours(query: any[] = []): Promise<any[]> {
    return this.listDocuments(query);
  }

  // Delete a labour by ID
  async deleteLabourById(labourId: string): Promise<any> {
    return this.deleteDocumentById(labourId);
  }
}
