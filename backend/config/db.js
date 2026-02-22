const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',// oddageam_school
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'school_management2',// oddageam_school_management
  password: process.env.DB_PASSWORD,  // SECURITY: No hardcoded fallback - must be in .env$
  port: process.env.DB_PORT || 5432,
});

module.exports = pool;