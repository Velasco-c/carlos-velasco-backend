export class MySqlJobRepository {
  constructor(pool) { this.pool = pool; }

  async findById(id) {
    const [rows] = await this.pool.execute(
      'SELECT id, title, min_years_experience AS minYearsExperience, status FROM jobs WHERE id = ?',
      [id]
    );
    return rows[0] ?? null;
  }

  async create({ title, minYearsExperience, status = 'OPEN' }) {
    const [result] = await this.pool.execute(
      'INSERT INTO jobs (title, min_years_experience, status) VALUES (?, ?, ?)',
      [title, minYearsExperience, status]
    );
    return this.findById(result.insertId);
  }

  async updateStatus(id, status) {
    const [result] = await this.pool.execute('UPDATE jobs SET status = ? WHERE id = ?', [status, id]);
    if (!result.affectedRows) return null;
    return this.findById(id);
  }
}
