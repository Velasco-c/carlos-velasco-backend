import { Router } from 'express';
import { validateRequest } from '../middlewares/validateRequest.js';
import { createCandidateSchema } from '../validators/basicValidators.js';

export function createCandidateRoutes(controller) {
  const router = Router();
  router.post('/', validateRequest(createCandidateSchema), controller.create);
  router.get('/:id', controller.get);
  return router;
}
