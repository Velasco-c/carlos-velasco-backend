export class ListApplications {
  constructor({ applicationRepository }) { this.applicationRepository = applicationRepository; }
  execute(filters) { return this.applicationRepository.list(filters); }
}
