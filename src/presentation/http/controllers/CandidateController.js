export class CandidateController {
  constructor({ candidateRepository }) { this.candidateRepository = candidateRepository; }
  create = async (req, res, next) => {
    try { res.status(201).json(await this.candidateRepository.create(req.body)); }
    catch (error) { next(error); }
  };
  get = async (req, res, next) => {
    try {
      const result = await this.candidateRepository.findById(Number(req.params.id));
      if (!result) return res.status(404).json({ error: { code: 'CANDIDATE_NOT_FOUND', message: 'Candidate not found' } });
      return res.status(200).json(result);
    } catch (error) { next(error); }
  };
}
