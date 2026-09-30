export class ApplicationController {
  constructor({ createApplication, getApplication, listApplications, updateApplicationStatus }) {
    this.createApplication = createApplication;
    this.getApplication = getApplication;
    this.listApplications = listApplications;
    this.updateApplicationStatus = updateApplicationStatus;
  }

  create = async (req, res, next) => {
    try { res.status(201).json(await this.createApplication.execute(req.body)); }
    catch (error) { next(error); }
  };

  get = async (req, res, next) => {
    try { res.status(200).json(await this.getApplication.execute(Number(req.params.id))); }
    catch (error) { next(error); }
  };

  list = async (req, res, next) => {
    try {
      const result = await this.listApplications.execute(req.query);
      res.status(200).json({ data: result });
    } catch (error) { next(error); }
  };

  updateStatus = async (req, res, next) => {
    try {
      const result = await this.updateApplicationStatus.execute({
        applicationId: Number(req.params.id),
        newStatus: req.body.status
      });
      res.status(200).json(result);
    } catch (error) { next(error); }
  };
}
