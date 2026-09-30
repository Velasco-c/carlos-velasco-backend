import { ApplicationStatus } from '../enums/ApplicationStatus.js';
import { DomainError } from '../errors/DomainError.js';

const transitions = Object.freeze({
  RECEIVED: ['IN_REVIEW', 'REJECTED'],
  IN_REVIEW: ['REJECTED', 'HIRED'],
  REJECTED: [],
  HIRED: []
});

export function assertValidStatusTransition(currentStatus, nextStatus) {
  if (!transitions[currentStatus]?.includes(nextStatus)) {
    throw new DomainError(
      `Invalid application status transition: ${currentStatus} -> ${nextStatus}`,
      'INVALID_STATUS_TRANSITION'
    );
  }
}

export function isRestrictedStatus(status) {
  return [ApplicationStatus.RECEIVED, ApplicationStatus.IN_REVIEW, ApplicationStatus.HIRED].includes(status);
}
