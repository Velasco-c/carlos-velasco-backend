import { Router } from 'express';
import { validateRequest } from '../middlewares/validateRequest.js';
import { createApplicationSchema, updateApplicationStatusSchema } from '../validators/applicationValidator.js';

export function createApplicationRoutes(controller) {
  const router = Router();
  router.post('/', validateRequest(createApplicationSchema), controller.create);
  router.get('/', controller.list);
  router.get('/:id', controller.get);
  router.patch('/:id/status', validateRequest(updateApplicationStatusSchema), controller.updateStatus);
  return router;
}
