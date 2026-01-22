import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/rassidi';

export const sql = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export async function testConnection() {
  try {
    await sql`SELECT 1`;
    console.log('✅ Database connected');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}
