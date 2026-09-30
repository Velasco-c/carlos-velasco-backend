import { Priority } from '../enums/Priority.js';
import { DomainError } from '../errors/DomainError.js';

/**
 * Business rule currently agreed for the reference implementation:
 * ratio = candidateExperience / requiredExperience.
 * < 0.50 => 30 LOW
 * < 1.00 => 60 MEDIUM
 * < 1.50 => 80 HIGH
 * >= 1.50 => 100 HIGH
 * If no experience is required, the candidate receives 100 HIGH.
 *
 * Keep this class isolated so the exact business formula can be replaced
 * without changing controllers, repositories, or use cases.
 */
export class PriorityCalculator {
  calculate({ candidateExperience, requiredExperience }) {
    if (!Number.isFinite(candidateExperience) || candidateExperience < 0) {
      throw new DomainError('Candidate experience must be a non-negative number', 'INVALID_CANDIDATE_EXPERIENCE');
    }

    if (!Number.isFinite(requiredExperience) || requiredExperience < 0) {
      throw new DomainError('Required experience must be a non-negative number', 'INVALID_REQUIRED_EXPERIENCE');
    }

    if (requiredExperience === 0) {
      return { score: 100, priority: Priority.HIGH };
    }

    const ratio = candidateExperience / requiredExperience;

    if (ratio < 0.5) return { score: 30, priority: Priority.LOW };
    if (ratio < 1) return { score: 60, priority: Priority.MEDIUM };
    if (ratio < 1.5) return { score: 80, priority: Priority.HIGH };
    return { score: 100, priority: Priority.HIGH };
  }
}
