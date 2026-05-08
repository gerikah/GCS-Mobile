import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

async function test() {
  const connectionString = 'postgresql://postgres.pvkqpevqmurbkgucvxsr:LIPAD2025-2026@aws-0-us-east-1.pooler.supabase.com:6543/postgres';
  const pool = new Pool({ connectionString });
  
  try {
    console.log('Testing connection to Supabase Pooler...');
    const res = await pool.query('SELECT NOW()');
    console.log('Success!', res.rows[0]);
  } catch (err) {
    console.error('Failed to connect:', err.message);
  } finally {
    await pool.end();
  }
}

test();
