import { config } from '../../client/appwriteClient';
import { BaseRepository } from '../baseRepository';
import { CarDTO } from '../../../app/lib/definitions';

//Using "any" because not sure of what is being returned.
export class CarService extends BaseRepository {
  constructor() {
    super(config.collections.cars); 
  }

  // Create a new car
  async createCar(data: CarDTO): Promise<any> {
    return this.createDocument(data);
  }

  // Get a car by ID
  async getCarById(carId: string): Promise<any | null> {
    return this.getDocumentById(carId);
  }

  // Update a car by ID
  async updateCarById(carId: string, data: CarDTO): Promise<any> {
    return this.updateDocumentById(carId, data);
  }

  // List all cars
  async listCars(query: any[] = []): Promise<any[]> {
    return this.listDocuments(query);
  }

  // Delete a car by ID
  async deleteCarById(carId: string): Promise<any> {
    return this.deleteDocumentById(carId);
  }
}
