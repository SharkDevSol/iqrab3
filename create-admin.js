const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://skoolific_user:Skoolific2024Pass@localhost:5432/school_management5022'
});

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await pool.query(
      'INSERT INTO users (username, password, user_type) VALUES ($1, $2, $3) ON CONFLICT (username) DO UPDATE SET password = $2',
      ['admin', hashedPassword, 'admin']
    );
    
    console.log('✅ Admin user created successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');
    
    await pool.end();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

createAdmin();
