import { CreateApplication } from '../../src/application/use-cases/CreateApplication.js';
import { PriorityCalculator } from '../../src/domain/services/PriorityCalculator.js';

function buildUseCase({ blockingApplication = null } = {}) {
  return new CreateApplication({
    candidateRepository: {
      findById: async () => ({ id: 1, yearsExperience: 4 })
    },
    jobRepository: {
      findById: async () => ({ id: 2, status: 'OPEN', minYearsExperience: 4 })
    },
    applicationRepository: {
      findBlockingApplication: async () => blockingApplication,
      create: async (data) => ({ id: 10, ...data })
    },
    priorityCalculator: new PriorityCalculator()
  });
}

describe('CreateApplication priority integration', () => {
  test('persists the calculated score and priority with RECEIVED status', async () => {
    const useCase = buildUseCase();
    const result = await useCase.execute({ candidateId: 1, jobId: 2, source: 'REFERRAL' });

    expect(result).toMatchObject({ score: 80, priority: 'HIGH', status: 'RECEIVED' });
  });

  test('rejects a blocked active application with HTTP-mappable domain code', async () => {
    const useCase = buildUseCase({ blockingApplication: { status: 'HIRED' } });

    await expect(useCase.execute({ candidateId: 1, jobId: 2, source: 'REFERRAL' }))
      .rejects.toMatchObject({ code: 'APPLICATION_RESTRICTED' });
  });

  test('rejects a REJECTED application inside the 30-day cooldown', async () => {
    const rejectedAt = new Date(Date.now() - 29 * 24 * 60 * 60 * 1000);
    const useCase = buildUseCase({ blockingApplication: { status: 'REJECTED', rejectedAt } });

    await expect(useCase.execute({ candidateId: 1, jobId: 2, source: 'REFERRAL' }))
      .rejects.toMatchObject({ code: 'APPLICATION_COOLDOWN' });
  });
});
