import { config } from '../../client/appwriteClient';
import { BaseRepository } from '../baseRepository';
import { CreateJobCardDTO, UpdateJobCardDTO } from '../../../app/lib/definitions';
import { buildStatusQuery } from '../../utils/helperFunctions';
import { STATUS_FIELDS } from '../../../app/lib/definitions';

export class JobCardService extends BaseRepository {
  constructor() {
    super(config.collections.jobCards); // Use jobCards collection from config
  }

  // Create a new job card with additional logic
  async createJobCard(data: CreateJobCardDTO, carsTableId: string): Promise<any> {
      const jobCardResult = await this.createDocument({
        ...data,
        jobCardStatus: 0, 
      });

      await this.updateDocumentById(
        data.carId,
        { carStatus: 1, jobCardId: jobCardResult["$id"] }
      );

      const carHistory = await this.getDocumentById(carsTableId);

      let tempJobCards = carHistory.allJobCards || [];
      tempJobCards.push(jobCardResult["$id"]);

      await this.updateDocumentById(carsTableId, {
        allJobCards: tempJobCards,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
      });

      return jobCardResult;
  }

  // Get a job card by ID
  async getJobCardById(jobCardId: string): Promise<any | null> {
    return this.getDocumentById(jobCardId);
  }

  // Update a job card by ID
  async updateJobCardById(jobCardId: string, data: UpdateJobCardDTO): Promise<any> {
    return this.updateDocumentById(jobCardId, data);
  }

  // List all job cards with optional status filtering
  async getAllJobCards(statuses?: number[]): Promise<any[]> {
    const query: any[] = statuses ? buildStatusQuery(statuses, STATUS_FIELDS.JOB_CARD_STATUS) : [];
    return this.listDocuments(query);
  }

  // Delete a job card by ID
  async deleteJobCardById(jobCardId: string): Promise<any> {
    return this.deleteDocumentById(jobCardId);
  }
}
