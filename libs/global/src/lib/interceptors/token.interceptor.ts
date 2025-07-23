import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

const lmsToken = (): string => {
  const secretKey = process.env['JWT_SECRET'];
  if (!secretKey) {
    throw new Error('JWT_SECRET_KEY is not defined in .env');
  }

  const payload = {
    username: 'test@test.com',
    roles: ['ADMIN', 'SYPER_ADMIN', 'TENANT'],
    user_id: 15,
    profile_ids: [],
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 360000 * 24 * 365 * 100,
  };

  return jwt.sign(payload, secretKey, { algorithm: 'HS256' });
};

export default lmsToken;
