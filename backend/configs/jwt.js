// Helper to fix formatting issues from environment variables
const dotenv = require('dotenv');
dotenv.config({path:"./../.env"});
const formatKey = (key) => {
  if (!key) return null;
  // This fix handles cases where newlines get converted to literal "\n" strings
  return key.replace(/\\n/g, '\n');
};

const private_key = formatKey(process.env.JWT_PRIVATE_KEY);
const public_key = formatKey(process.env.JWT_PUBLIC_KEY);
if (private_key && public_key) {
  console.log('✓ RSA keys loaded successfully from environment variables');
} else {
  console.warn('⚠ Warning: RSA keys missing. JWT authentication will fail.');
}
module.exports = {
  private_key,
  public_key,
  // If you use a secret fallback for non-RSA tokens:
  jwt_secret: process.env.JWT_SECRET || 'fallback_secret_only_for_dev',
  jwt_expires_in: process.env.JWT_EXPIRES_IN || '1hr',
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
};
