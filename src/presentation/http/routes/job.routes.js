import { Router } from 'express';
import { validateRequest } from '../middlewares/validateRequest.js';
import { createJobSchema, updateJobStatusSchema } from '../validators/basicValidators.js';

export function createJobRoutes(controller) {
  const router = Router();
  router.post('/', validateRequest(createJobSchema), controller.create);
  router.get('/:id', controller.get);
  router.patch('/:id/status', validateRequest(updateJobStatusSchema), controller.updateStatus);
  return router;
}
