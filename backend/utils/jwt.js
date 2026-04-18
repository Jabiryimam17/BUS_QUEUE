const jwt = require('jsonwebtoken');
const jwt_config = require('../configs/jwt');

const get_signing_key = () => {
  // Use private key if available, otherwise fall back to secret
  if (jwt_config.private_key) {
    return {
      key: jwt_config.private_key,
      algorithm: 'RS256'
    };
  }
  return {
    key: jwt_config.jwt_secret,
    algorithm: 'HS256'
  };
};

const get_verification_key = () => {
  // Use public key if available, otherwise fall back to secret
  if (jwt_config.public_key) {
    return {
      key: jwt_config.public_key,
      algorithm: 'RS256'
    };
  }
  return {
    key: jwt_config.jwt_secret,
    algorithm: 'HS256'
  };
};

const generate_token = (payload) => {
  const signing = get_signing_key();
  const options = {
    expiresIn: jwt_config.jwt_expires_in,
    algorithm: signing.algorithm
  };
  
  return jwt.sign(payload, signing.key, options);
};

const verify_token = (token) => {
  try {
    const verification = get_verification_key();
    return jwt.verify(token, verification.key, {
      algorithms: [verification.algorithm]
    });
  } catch (error) {
    return null;
  }
};

const generate_refresh_token = (payload) => {
  const signing = get_signing_key();
  const options = {
    expiresIn: jwt_config.jwt_refresh_expires_in,
    algorithm: signing.algorithm
  };
  
  return jwt.sign(payload, signing.key, options);
};

const verify_refresh_token = (token) => {
  try {
    const verification = get_verification_key();
    return jwt.verify(token, verification.key, {
      algorithms: [verification.algorithm]
    });
  } catch (error) {
    return null;
  }
};

module.exports = {
  generate_token,
  verify_token,
  generate_refresh_token,
  verify_refresh_token
};
