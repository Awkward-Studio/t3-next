import { config } from '../../client/appwriteClient';
import { BaseRepository } from '../baseRepository';
import { TempCarDTO, STATUS_FIELDS } from '../../../app/lib/definitions';
import { buildStatusQuery } from '../../utils/helperFunctions';
import { Query } from 'appwrite';
import { CAR_FIELDS } from '@/backend/utils/constants';

export class TempCarService extends BaseRepository {
  constructor() {
    super(config.collections.tempCars); 
  }

  // Create a new temp car
  async createTempCar(data: TempCarDTO): Promise<any> {
    let tempCarData = {
        ...data,
        carStatus: 0
    }
    return this.createDocument(tempCarData);
  }

  // Get a temp car by ID
  async getTempCarById(carId: string): Promise<any | null> {
    return this.getDocumentById(carId);
  }

  async searchTempCar(searchTerm: string, statuses: number[]): Promise<any | null> {
    let statusQuery: any[] = buildStatusQuery(statuses, STATUS_FIELDS.CAR_STATUS);
    let query: any[] = [Query.contains(CAR_FIELDS.CAR_NUMBER, [searchTerm]), ...statusQuery];
    return this.listDocuments(query);
  }

  // Update a temp car by ID
  async updateTempCarById(carId: string, data: TempCarDTO): Promise<any> {
    return this.updateDocumentById(carId, data);
  }

  // List all temp cars
  async listTempCars(query: any[] = []): Promise<any[]> {
    return this.listDocuments(query);
  }

  // Delete a temp car by ID
  async deleteTempCarById(carId: string): Promise<any> {
    return this.deleteDocumentById(carId);
  }
}
