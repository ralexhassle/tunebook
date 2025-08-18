/**
 * API-related types and interfaces
 */

import { Timestamp } from './common';

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = any> {
  /** Response data */
  data: T;
  /** Success status */
  success: boolean;
  /** Error information */
  error?: ApiError;
  /** Response metadata */
  meta?: ApiMeta;
}

/**
 * API error structure
 */
export interface ApiError {
  /** Error code */
  code: string;
  /** Human-readable message */
  message: string;
  /** Additional error details */
  details?: Record<string, any>;
  /** Stack trace (development only) */
  stack?: string;
}

/**
 * API response metadata
 */
export interface ApiMeta {
  /** Request timestamp */
  timestamp: Timestamp;
  /** Request ID for tracing */
  requestId?: string;
  /** API version */
  version?: string;
  /** Pagination info */
  pagination?: PaginationMeta;
  /** Performance metrics */
  performance?: PerformanceMeta;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  /** Current page number */
  page: number;
  /** Items per page */
  pageSize: number;
  /** Total number of items */
  total: number;
  /** Total number of pages */
  totalPages: number;
  /** Has next page */
  hasNext: boolean;
  /** Has previous page */
  hasPrevious: boolean;
}

/**
 * Performance metadata
 */
export interface PerformanceMeta {
  /** Request duration in milliseconds */
  duration: number;
  /** Database query time */
  dbTime?: number;
  /** Cache hit/miss */
  cacheHit?: boolean;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  /** Page number (1-based) */
  page?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Maximum page size allowed */
  maxPageSize?: number;
}

/**
 * Sort parameters
 */
export interface SortParams {
  /** Field to sort by */
  sortBy?: string;
  /** Sort direction */
  sortOrder?: 'asc' | 'desc';
}

/**
 * Filter parameters
 */
export interface FilterParams {
  /** Text search query */
  q?: string;
  /** Additional filters */
  [key: string]: any;
}

/**
 * Standard query parameters
 */
export interface QueryParams
  extends PaginationParams,
    SortParams,
    FilterParams {
  /** Include related data */
  include?: string[];
  /** Fields to select */
  fields?: string[];
}

/**
 * HTTP methods
 */
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
}

/**
 * HTTP status codes
 */
export enum HttpStatus {
  // Success
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,

  // Redirection
  MOVED_PERMANENTLY = 301,
  FOUND = 302,
  NOT_MODIFIED = 304,

  // Client Error
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,

  // Server Error
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}

/**
 * API endpoint definition
 */
export interface ApiEndpoint {
  /** HTTP method */
  method: HttpMethod;
  /** URL path */
  path: string;
  /** Description */
  description?: string;
  /** Request body schema */
  requestSchema?: any;
  /** Response schema */
  responseSchema?: any;
  /** Authentication required */
  requiresAuth?: boolean;
  /** Rate limit override */
  rateLimit?: number;
}

/**
 * Bulk operation request
 */
export interface BulkRequest<T> {
  /** Items to process */
  items: T[];
  /** Operation type */
  operation: 'create' | 'update' | 'delete';
  /** Options */
  options?: BulkOptions;
}

/**
 * Bulk operation options
 */
export interface BulkOptions {
  /** Continue on error */
  continueOnError?: boolean;
  /** Batch size */
  batchSize?: number;
  /** Validate before processing */
  validate?: boolean;
}

/**
 * Bulk operation response
 */
export interface BulkResponse<T> {
  /** Successfully processed items */
  success: T[];
  /** Failed items with errors */
  errors: BulkError<T>[];
  /** Summary statistics */
  summary: BulkSummary;
}

/**
 * Bulk operation error
 */
export interface BulkError<T> {
  /** The item that failed */
  item: T;
  /** Error information */
  error: ApiError;
  /** Index in original array */
  index: number;
}

/**
 * Bulk operation summary
 */
export interface BulkSummary {
  /** Total items processed */
  total: number;
  /** Number of successful operations */
  success: number;
  /** Number of failed operations */
  failed: number;
  /** Processing time in milliseconds */
  duration: number;
}
