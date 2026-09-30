import { DomainError } from '../../domain/errors/DomainError.js';

export class GetApplication {
  constructor({ applicationRepository }) { this.applicationRepository = applicationRepository; }
  async execute(id) {
    const application = await this.applicationRepository.findById(id);
    if (!application) throw new DomainError('Application not found', 'APPLICATION_NOT_FOUND');
    return application;
  }
}
