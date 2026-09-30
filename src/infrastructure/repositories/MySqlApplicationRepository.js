export class MySqlApplicationRepository {
  constructor(pool) { this.pool = pool; }

  async findBlockingApplication(candidateId, jobId) {
    const [rows] = await this.pool.execute(
      `SELECT id, status, rejected_at AS rejectedAt
       FROM applications
       WHERE candidate_id = ? AND job_id = ?
       ORDER BY created_at DESC
       LIMIT 1`,
      [candidateId, jobId]
    );
    return rows[0] ?? null;
  }

  async create(data) {
    try {
      const [result] = await this.pool.execute(
        `INSERT INTO applications
          (candidate_id, job_id, cover_letter, source, score, priority, status)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [data.candidateId, data.jobId, data.coverLetter, data.source, data.score, data.priority, data.status]
      );
      return this.findById(result.insertId);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') error.code = 'APPLICATION_RESTRICTED';
      throw error;
    }
  }

  async findById(id) {
    const [rows] = await this.pool.execute(
      `SELECT id, candidate_id AS candidateId, job_id AS jobId, cover_letter AS coverLetter,
              source, score, priority, status, created_at AS createdAt,
              status_updated_at AS statusUpdatedAt, rejected_at AS rejectedAt
       FROM applications WHERE id = ?`,
      [id]
    );
    return rows[0] ?? null;
  }

  async list({ jobId, candidateId, status, priority, source, limit = 20, offset = 0 }) {
    const conditions = [];
    const params = [];
    if (jobId) { conditions.push('job_id = ?'); params.push(jobId); }
    if (candidateId) { conditions.push('candidate_id = ?'); params.push(candidateId); }
    if (status) { conditions.push('status = ?'); params.push(status); }
    if (priority) { conditions.push('priority = ?'); params.push(priority); }
    if (source) { conditions.push('source = ?'); params.push(source); }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const safeOffset = Math.max(Number(offset) || 0, 0);
    const [rows] = await this.pool.execute(
      `SELECT id, candidate_id AS candidateId, job_id AS jobId, source, score, priority,
              status, created_at AS createdAt, status_updated_at AS statusUpdatedAt
       FROM applications ${where}
       ORDER BY priority DESC, score DESC, created_at ASC
       LIMIT ${safeLimit} OFFSET ${safeOffset}`,
      params
    );
    return rows;
  }

  async updateStatus(id, newStatus) {
    const rejectedAt = newStatus === 'REJECTED' ? new Date() : null;
    const [result] = await this.pool.execute(
      `UPDATE applications
       SET status = ?, status_updated_at = CURRENT_TIMESTAMP(3), rejected_at = ?
       WHERE id = ?`,
      [newStatus, rejectedAt, id]
    );
    if (!result.affectedRows) return null;
    return this.findById(id);
  }
}
