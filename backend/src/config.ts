import 'dotenv/config';

export const PORT = Number(process.env.PORT || 5050);
export const JWT_SECRET = process.env.JWT_SECRET || 'dev-super-secret';
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
export const DATABASE_URL = process.env.DATABASE_URL!;
export const UPLOAD_STRATEGY = (process.env.UPLOAD_STRATEGY || 'local') as 'local'|'cloudinary'|'s3';
export const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';

export const SMTP = {
  host: process.env.SMTP_HOST || '',
  port: Number(process.env.SMTP_PORT || 587),
  user: process.env.SMTP_USER || '',
  pass: process.env.SMTP_PASS || '',
  from: process.env.SMTP_FROM || 'GreenSteps <no-reply@greensteps.app>'
};
