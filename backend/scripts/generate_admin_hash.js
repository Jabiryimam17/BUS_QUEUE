const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter admin password: ', async (password) => {
  try {
    const hash = await bcrypt.hash(password, 10);
    console.log('\nGenerated hash:');
    console.log(hash);
    console.log('\nAdd this to your database schema or update admin user.');
    rl.close();
  } catch (error) {
    console.error('Error generating hash:', error);
    rl.close();
  }
});
