import { ApplicationSource } from '../../domain/enums/ApplicationSource.js';
import { JobStatus } from '../../domain/enums/JobStatus.js';
import { DomainError } from '../../domain/errors/DomainError.js';

const ALLOWED_SOURCES = new Set(Object.values(ApplicationSource));
const COOLDOWN_DAYS = 30;

export class CreateApplication {
  constructor({ candidateRepository, jobRepository, applicationRepository, priorityCalculator }) {
    this.candidateRepository = candidateRepository;
    this.jobRepository = jobRepository;
    this.applicationRepository = applicationRepository;
    this.priorityCalculator = priorityCalculator;
  }

  async execute({ candidateId, jobId, coverLetter = null, source }) {
    if (!candidateId || !jobId || !source) {
      throw new DomainError('candidateId, jobId and source are required', 'VALIDATION_ERROR');
    }

    if (!ALLOWED_SOURCES.has(source)) {
      throw new DomainError(`Invalid application source: ${source}`, 'INVALID_APPLICATION_SOURCE');
    }

    const candidate = await this.candidateRepository.findById(candidateId);
    if (!candidate) {
      throw new DomainError('Candidate not found', 'CANDIDATE_NOT_FOUND');
    }

    const job = await this.jobRepository.findById(jobId);
    if (!job) {
      throw new DomainError('Job not found', 'JOB_NOT_FOUND');
    }

    if (job.status !== JobStatus.OPEN) {
      throw new DomainError('Job is not open for applications', 'JOB_CLOSED');
    }

    const blockingApplication = await this.applicationRepository.findBlockingApplication(candidateId, jobId);
    if (blockingApplication) {
      if (['RECEIVED', 'IN_REVIEW', 'HIRED'].includes(blockingApplication.status)) {
        throw new DomainError(
          `Candidate already has a ${blockingApplication.status} application for this job`,
          'APPLICATION_RESTRICTED'
        );
      }

      if (blockingApplication.status === 'REJECTED') {
        const rejectedAt = new Date(blockingApplication.rejectedAt);
        const cooldownEnd = new Date(rejectedAt.getTime() + COOLDOWN_DAYS * 24 * 60 * 60 * 1000);
        if (new Date() < cooldownEnd) {
          throw new DomainError(
            `Candidate must wait until ${cooldownEnd.toISOString()} before reapplying`,
            'APPLICATION_COOLDOWN'
          );
        }
      }
    }

    const { score, priority } = this.priorityCalculator.calculate({
      candidateExperience: Number(candidate.yearsExperience),
      requiredExperience: Number(job.minYearsExperience)
    });

    return this.applicationRepository.create({
      candidateId,
      jobId,
      coverLetter,
      source,
      score,
      priority,
      status: 'RECEIVED'
    });
  }
}
