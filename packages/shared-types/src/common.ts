/**
 * Common types used throughout the Tunebook application
 */

/**
 * Generic ID type
 */
export type ID = string;

/**
 * Timestamp type
 */
export type Timestamp = string | Date;

/**
 * Generic key-value object
 */
export type KeyValue<T = any> = Record<string, T>;

/**
 * Optional fields utility type
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Make all properties required
 */
export type Required<T> = {
  [P in keyof T]-?: T[P];
};

/**
 * Deep partial type
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Environment types
 */
export enum Environment {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
  TEST = 'test'
}

/**
 * Log levels
 */
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  TRACE = 'trace'
}

/**
 * Generic configuration interface
 */
export interface Config {
  /** Environment */
  env: Environment;
  /** Log level */
  logLevel: LogLevel;
  /** Database configuration */
  database: DatabaseConfig;
  /** Redis configuration */
  redis: RedisConfig;
  /** API configuration */
  api: ApiConfig;
  /** External services */
  external: ExternalConfig;
}

/**
 * Database configuration
 */
export interface DatabaseConfig {
  /** Database URL */
  url: string;
  /** Connection pool size */
  poolSize?: number;
  /** Connection timeout */
  timeout?: number;
  /** Enable SSL */
  ssl?: boolean;
}

/**
 * Redis configuration
 */
export interface RedisConfig {
  /** Redis URL */
  url: string;
  /** Key prefix */
  keyPrefix?: string;
  /** Default TTL in seconds */
  defaultTtl?: number;
}

/**
 * API configuration
 */
export interface ApiConfig {
  /** Port number */
  port: number;
  /** Host address */
  host?: string;
  /** CORS origins */
  corsOrigins?: string[];
  /** Rate limiting */
  rateLimit?: RateLimitConfig;
}

/**
 * Rate limiting configuration
 */
export interface RateLimitConfig {
  /** Maximum requests per window */
  max: number;
  /** Time window in milliseconds */
  windowMs: number;
  /** Skip successful requests */
  skipSuccessfulRequests?: boolean;
}

/**
 * External services configuration
 */
export interface ExternalConfig {
  /** TheSession.org data URL */
  theSessionDataUrl: string;
  /** Other external APIs */
  [key: string]: string;
}