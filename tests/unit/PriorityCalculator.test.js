import { PriorityCalculator } from '../../src/domain/services/PriorityCalculator.js';

describe('PriorityCalculator', () => {
  const calculator = new PriorityCalculator();

  test('returns maximum score when candidate has at least 150% of required experience', () => {
    expect(calculator.calculate({ candidateExperience: 6, requiredExperience: 4 }))
      .toEqual({ score: 100, priority: 'HIGH' });
  });

  test('handles the exact 100% boundary as HIGH with score 80', () => {
    expect(calculator.calculate({ candidateExperience: 4, requiredExperience: 4 }))
      .toEqual({ score: 80, priority: 'HIGH' });
  });

  test('handles zero required experience as maximum priority', () => {
    expect(calculator.calculate({ candidateExperience: 0, requiredExperience: 0 }))
      .toEqual({ score: 100, priority: 'HIGH' });
  });
});
