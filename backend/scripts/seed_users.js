const bcrypt = require('bcryptjs');
const { get_pool } = require('../configs/database');

// Configuration
const TOTAL_USERS = 30; // total number of test users to create
const ADMIN_COUNT = 3;  // number of admin users (the rest will be students)

const departments = [
  'Computer Science',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Business Administration',
  'Mathematics',
  'Physics',
  'Chemistry'
];

function random_item(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generate_user(index, is_admin) {
  const user_type = is_admin ? 'admin' : 'student';
  const id_prefix = is_admin ? 'ADM' : 'STD';

  const university_id = `TEST${id_prefix}${String(index).padStart(3, '0')}`;
  const name = is_admin
    ? `Admin User ${index}`
    : `Student User ${index}`;
  const email = is_admin
    ? `test.admin${index}@example.com`
    : `test.student${index}@example.com`;

  const department = random_item(departments);

  return {
    university_id,
    name,
    email,
    department,
    user_type
  };
}

async function seed_users() {
  const pool = get_pool();

  try {
    console.log('Seeding test users...');

    // Hash the test password once and reuse
    const password_hash = await bcrypt.hash('123456', 10);

    const insert_sql = `
      INSERT INTO users (
        university_id,
        name,
        email,
        password_hash,
        department,
        status,
        user_type
      ) VALUES ($1, $2, $3, $4, $5, 'approved', $6)
      ON CONFLICT (email) DO UPDATE SET
        university_id = EXCLUDED.university_id,
        name = EXCLUDED.name,
        department = EXCLUDED.department,
        status = EXCLUDED.status,
        user_type = EXCLUDED.user_type
    `;

    // Create admin users
    for (let i = 1; i <= ADMIN_COUNT; i++) {
      const user = generate_user(i, true);
      await pool.query(insert_sql, [
        user.university_id,
        user.name,
        user.email,
        password_hash,
        user.department,
        user.user_type
      ]);
      console.log(`Admin created/updated: ${user.email}`);
    }

    // Create student users
    for (let i = ADMIN_COUNT + 1; i <= TOTAL_USERS; i++) {
      const user = generate_user(i, false);
      await pool.query(insert_sql, [
        user.university_id,
        user.name,
        user.email,
        password_hash,
        user.department,
        user.user_type
      ]);
      console.log(`Student created/updated: ${user.email}`);
    }

    console.log(`Done. Seeded up to ${TOTAL_USERS} users (with ${ADMIN_COUNT} admins).`);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exitCode = 1;
  } finally {
    try {
      const pool_to_end = get_pool();
      if (pool_to_end && typeof pool_to_end.end === 'function') {
        await pool_to_end.end();
      }
    } catch (e) {
      console.error('Error closing database pool:', e);
    }
  }
}

seed_users();

