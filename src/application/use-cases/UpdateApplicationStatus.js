import { assertValidStatusTransition } from '../../domain/entities/Application.js';
import { DomainError } from '../../domain/errors/DomainError.js';

export class UpdateApplicationStatus {
  constructor({ applicationRepository }) {
    this.applicationRepository = applicationRepository;
  }

  async execute({ applicationId, newStatus }) {
    const application = await this.applicationRepository.findById(applicationId);
    if (!application) throw new DomainError('Application not found', 'APPLICATION_NOT_FOUND');

    assertValidStatusTransition(application.status, newStatus);
    return this.applicationRepository.updateStatus(applicationId, newStatus);
  }
}
