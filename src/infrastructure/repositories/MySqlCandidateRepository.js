export class MySqlCandidateRepository {
  constructor(pool) { this.pool = pool; }

  async findById(id) {
    const [rows] = await this.pool.execute(
      'SELECT id, full_name AS fullName, email, years_experience AS yearsExperience FROM candidates WHERE id = ?',
      [id]
    );
    return rows[0] ?? null;
  }

  async create({ fullName, email, yearsExperience }) {
    const [result] = await this.pool.execute(
      'INSERT INTO candidates (full_name, email, years_experience) VALUES (?, ?, ?)',
      [fullName, email, yearsExperience]
    );
    return this.findById(result.insertId);
  }
}
