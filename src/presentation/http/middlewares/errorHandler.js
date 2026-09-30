export function errorHandler(error, req, res, next) {
  const mapping = {
    VALIDATION_ERROR: 400,
    INVALID_APPLICATION_SOURCE: 400,
    INVALID_CANDIDATE_EXPERIENCE: 400,
    INVALID_REQUIRED_EXPERIENCE: 400,
    CANDIDATE_NOT_FOUND: 404,
    JOB_NOT_FOUND: 404,
    APPLICATION_NOT_FOUND: 404,
    JOB_CLOSED: 409,
    APPLICATION_RESTRICTED: 409,
    APPLICATION_COOLDOWN: 409,
    INVALID_STATUS_TRANSITION: 409,
    ER_DUP_ENTRY: 409
  };

  const status = mapping[error.code] ?? 500;
  res.status(status).json({
    error: {
      code: error.code ?? 'INTERNAL_SERVER_ERROR',
      message: error.message ?? 'Internal server error'
    }
  });
}
