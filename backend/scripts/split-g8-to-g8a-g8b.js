/**
 * Split table "G8" into "G8A" and "G8B" based on class column
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const db = require('../config/db');

async function split() {
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    // Check current state
    const total = await client.query('SELECT COUNT(*) FROM classes_schema."G8"');
    const g8aCount = await client.query(`SELECT COUNT(*) FROM classes_schema."G8" WHERE class = 'G8A'`);
    const g8bCount = await client.query(`SELECT COUNT(*) FROM classes_schema."G8" WHERE class = 'G8B'`);
    console.log('Total in G8:', total.rows[0].count);
    console.log('G8A students:', g8aCount.rows[0].count);
    console.log('G8B students:', g8bCount.rows[0].count);

    // Get columns from G8 table
    const cols = await client.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_schema = 'classes_schema' AND table_name = 'G8'
      ORDER BY ordinal_position
    `);
    const colList = cols.rows.map(r => `"${r.column_name}"`).join(', ');
    console.log('Columns:', colList);

    // Create G8A table (copy structure from G8)
    await client.query(`CREATE TABLE IF NOT EXISTS classes_schema."G8A" AS SELECT * FROM classes_schema."G8" WHERE 1=0`);
    console.log('Created G8A table');

    // Create G8B table (copy structure from G8)
    await client.query(`CREATE TABLE IF NOT EXISTS classes_schema."G8B" AS SELECT * FROM classes_schema."G8" WHERE 1=0`);
    console.log('Created G8B table');

    // Insert G8A students
    const insertA = await client.query(`INSERT INTO classes_schema."G8A" SELECT * FROM classes_schema."G8" WHERE class = 'G8A'`);
    console.log('Inserted into G8A:', insertA.rowCount, 'students');

    // Insert G8B students
    const insertB = await client.query(`INSERT INTO classes_schema."G8B" SELECT * FROM classes_schema."G8" WHERE class = 'G8B'`);
    console.log('Inserted into G8B:', insertB.rowCount, 'students');

    // Drop old G8 table
    await client.query(`DROP TABLE classes_schema."G8"`);
    console.log('Dropped old G8 table');

    await client.query('COMMIT');
    console.log('\n✅ Done! G8 split into G8A and G8B successfully.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error:', err.message);
  } finally {
    client.release();
    process.exit(0);
  }
}

split();
