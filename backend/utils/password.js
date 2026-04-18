const bcrypt = require('bcryptjs');

const hash_password = async (password) => {
  const salt_rounds = 10;
  return await bcrypt.hash(password, salt_rounds);
};

const compare_password = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

module.exports = {
  hash_password,
  compare_password
};
