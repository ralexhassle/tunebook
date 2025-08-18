/**
 * @tunebook/shared-types
 *
 * Shared TypeScript types and interfaces for the Tunebook monorepo
 */

// Re-export all TheSession.org related types
export * from './thesession';

// Re-export real data-driven enums
export * from './enums';

// Re-export common types
export * from './common';

// Re-export API types with type-only exports where needed
export type {
  ApiResponse,
  ApiError,
  ApiMeta,
  PaginationMeta,
  PerformanceMeta,
  PaginationParams,
  SortParams,
  FilterParams,
  QueryParams,
  ApiEndpoint,
  BulkRequest,
  BulkOptions,
  BulkResponse,
  BulkError,
  BulkSummary,
} from './api';

export { HttpMethod, HttpStatus } from './api';

// Re-export search types with type-only exports where needed
export type {
  SearchCriteria,
  SearchFilter,
  SearchPagination,
  SearchOptions,
  SearchResult,
  SearchHighlight,
  SearchExplanation,
  SearchResponse,
  SearchFacet,
  SearchFacetValue,
  SearchSuggestion,
  AutocompleteRequest,
  AutocompleteResponse,
  AutocompleteSuggestion,
  SearchIndexConfig,
  SearchFieldConfig,
  SearchAnalyzerConfig,
  SearchIndexSettings,
} from './search';

export {
  FilterOperator,
  LogicalOperator,
  SortDirection,
  SuggestionType,
  SearchFieldType,
} from './search';

export type { SortCriteria } from './search';
