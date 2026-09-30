import express from 'express';
import { pool } from './infrastructure/database/connection.js';
import { MySqlCandidateRepository } from './infrastructure/repositories/MySqlCandidateRepository.js';
import { MySqlJobRepository } from './infrastructure/repositories/MySqlJobRepository.js';
import { MySqlApplicationRepository } from './infrastructure/repositories/MySqlApplicationRepository.js';
import { PriorityCalculator } from './domain/services/PriorityCalculator.js';
import { CreateApplication } from './application/use-cases/CreateApplication.js';
import { GetApplication } from './application/use-cases/GetApplication.js';
import { ListApplications } from './application/use-cases/ListApplications.js';
import { UpdateApplicationStatus } from './application/use-cases/UpdateApplicationStatus.js';
import { ApplicationController } from './presentation/http/controllers/ApplicationController.js';
import { CandidateController } from './presentation/http/controllers/CandidateController.js';
import { JobController } from './presentation/http/controllers/JobController.js';
import { createApplicationRoutes } from './presentation/http/routes/application.routes.js';
import { createCandidateRoutes } from './presentation/http/routes/candidate.routes.js';
import { createJobRoutes } from './presentation/http/routes/job.routes.js';
import { errorHandler } from './presentation/http/middlewares/errorHandler.js';

const candidateRepository = new MySqlCandidateRepository(pool);
const jobRepository = new MySqlJobRepository(pool);
const applicationRepository = new MySqlApplicationRepository(pool);
const priorityCalculator = new PriorityCalculator();

const createApplication = new CreateApplication({ candidateRepository, jobRepository, applicationRepository, priorityCalculator });
const getApplication = new GetApplication({ applicationRepository });
const listApplications = new ListApplications({ applicationRepository });
const updateApplicationStatus = new UpdateApplicationStatus({ applicationRepository });

const applicationController = new ApplicationController({ createApplication, getApplication, listApplications, updateApplicationStatus });
const candidateController = new CandidateController({ candidateRepository });
const jobController = new JobController({ jobRepository });

export const app = express();
app.use(express.json());
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));
app.use('/api/v1/candidates', createCandidateRoutes(candidateController));
app.use('/api/v1/jobs', createJobRoutes(jobController));
app.use('/api/v1/applications', createApplicationRoutes(applicationController));
app.use(errorHandler);
