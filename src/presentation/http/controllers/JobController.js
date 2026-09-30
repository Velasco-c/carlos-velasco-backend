export class JobController {
  constructor({ jobRepository }) { this.jobRepository = jobRepository; }
  create = async (req, res, next) => {
    try { res.status(201).json(await this.jobRepository.create(req.body)); }
    catch (error) { next(error); }
  };
  get = async (req, res, next) => {
    try {
      const result = await this.jobRepository.findById(Number(req.params.id));
      if (!result) return res.status(404).json({ error: { code: 'JOB_NOT_FOUND', message: 'Job not found' } });
      return res.status(200).json(result);
    } catch (error) { next(error); }
  };
  updateStatus = async (req, res, next) => {
    try {
      const result = await this.jobRepository.updateStatus(Number(req.params.id), req.body.status);
      if (!result) return res.status(404).json({ error: { code: 'JOB_NOT_FOUND', message: 'Job not found' } });
      return res.status(200).json(result);
    } catch (error) { next(error); }
  };
}
