import { config } from '../../client/appwriteClient';
import { BaseRepository } from '../baseRepository';
import {  } from '../../../app/lib/definitions';

export class PartService extends BaseRepository {
  constructor() {
    super(config.collections.parts); 
  }

  // Create a new part
  async createPart(data: any): Promise<any> {
    return this.createDocument(data);
  }

  // Get a part by ID
  async getPartById(partId: string): Promise<any | null> {
    return this.getDocumentById(partId);
  }

  // Update a part by ID
  async updatePartById(partId: string, data: any): Promise<any> {
    return this.updateDocumentById(partId, data);
  }

  // List all parts
  async listParts(query: any[] = []): Promise<any[]> {
    return this.listDocuments(query);
  }

  // Delete a part by ID
  async deletePartById(partId: string): Promise<any> {
    return this.deleteDocumentById(partId);
  }
}
