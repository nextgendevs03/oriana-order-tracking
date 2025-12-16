import jwt, { SignOptions } from 'jsonwebtoken';

export interface JWTPayload {
  // userId: string;
  username: string;
  email?: string;
  role?: string;
  [key: string]: any;
}

export interface TokenResult {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
  refreshExpiresIn: number; // seconds
}
const getJWTSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.ENVIRONMENT === 'prod' || process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET must be set in production environment');
    }
    console.warn('  JWT_SECRET not set, using default secret (ONLY FOR LOCAL DEV)');
    return 'your-super-secret-jwt-key-change-in-production';
  }
  return secret;
};

const getJWTRefreshSecret = (): string => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    if (process.env.ENVIRONMENT === 'prod' || process.env.NODE_ENV === 'production') {
      throw new Error('JWT_REFRESH_SECRET must be set in production environment');
    }
    console.warn('JWT_REFRESH_SECRET not set, using default secret (ONLY FOR LOCAL DEV)');
    return 'your-super-secret-refresh-key-change-in-production';
  }
  return secret;
};

const getAccessTokenExpiry = (): string => {
  return process.env.JWT_EXPIRES_IN || '15m';
};

const getRefreshTokenExpiry = (): string => {
  return process.env.JWT_REFRESH_EXPIRES_IN || '7d';
};

const parseExpiryToSeconds = (expiry: string): number => {
  const numValue = parseInt(expiry, 10);
  if (!isNaN(numValue) && expiry === numValue.toString()) {
    return numValue;
  }

  const match = expiry.match(/^(\d+)([smhd])$/);
  if (!match) {
    return 900; // Default to 15 minutes
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 's':
      return value;
    case 'm':
      return value * 60;
    case 'h':
      return value * 60 * 60;
    case 'd':
      return value * 24 * 60 * 60;
    default:
      return 900;
  }
};

/**
 * Generate Access Token
 * Short-lived token for API authentication (default: 15 minutes)
 *
 * @param payload - User data to encode in the token
 * @returns Access token string
 */
export const generateAccessToken = (payload: JWTPayload): string => {
  const secret = getJWTSecret();
  const expiresIn = getAccessTokenExpiry();

  const options: SignOptions = {
    expiresIn: expiresIn as any,
    issuer: 'oriana-api',
    audience: 'oriana-client',
  };
  const token = jwt.sign(payload, secret, options);

  return token;
};

export const verifyAccessToken = (token: string): JWTPayload => {
  const secret = getJWTSecret();

  try {
    const decoded = jwt.verify(token, secret, {
      issuer: 'oriana-api',
      audience: 'oriana-client',
    }) as JWTPayload;

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Access token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid access token');
    }
    throw error;
  }
};

export const generateRefreshToken = (payload: JWTPayload): string => {
  const secret = getJWTRefreshSecret();
  const expiresIn = getRefreshTokenExpiry();

  const options: SignOptions = {
    expiresIn: expiresIn as any,
    issuer: 'oriana-api',
    audience: 'oriana-client',
  };

  const token = jwt.sign(payload as object, secret, options);

  return token;
};

export const verifyRefreshToken = (token: string): JWTPayload => {
  const secret = getJWTRefreshSecret();

  try {
    const decoded = jwt.verify(token, secret, {
      issuer: 'oriana-api',
      audience: 'oriana-client',
    }) as JWTPayload;

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Refresh token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid refresh token');
    }
    throw error;
  }
};

/**
 * Generate Both Tokens
 * Convenience function to generate both access and refresh tokens at once
 *
 * @param payload - User data to encode in the tokens
 * @returns Object containing both tokens and expiration info
 */
export const generateTokens = (payload: JWTPayload): TokenResult => {
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Parse expiration times to seconds
  const accessExpiresIn = parseExpiryToSeconds(getAccessTokenExpiry());
  const refreshExpiresIn = parseExpiryToSeconds(getRefreshTokenExpiry());

  return {
    accessToken,
    refreshToken,
    expiresIn: accessExpiresIn,
    refreshExpiresIn: refreshExpiresIn,
  };
};
