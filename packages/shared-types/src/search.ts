/**
 * Search and filtering related types
 */

// Search and filtering related types

/**
 * Generic search criteria
 */
export interface SearchCriteria {
  /** Text query */
  query?: string;
  /** Filters to apply */
  filters?: SearchFilter[];
  /** Sort criteria */
  sort?: SortCriteria[];
  /** Pagination */
  pagination?: SearchPagination;
  /** Search options */
  options?: SearchOptions;
}

/**
 * Search filter
 */
export interface SearchFilter {
  /** Field to filter on */
  field: string;
  /** Filter operator */
  operator: FilterOperator;
  /** Filter value(s) */
  value: any;
  /** Logical operator with next filter */
  logic?: LogicalOperator;
}

/**
 * Filter operators
 */
export enum FilterOperator {
  EQUALS = 'eq',
  NOT_EQUALS = 'ne',
  GREATER_THAN = 'gt',
  GREATER_THAN_OR_EQUAL = 'gte',
  LESS_THAN = 'lt',
  LESS_THAN_OR_EQUAL = 'lte',
  IN = 'in',
  NOT_IN = 'nin',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'not_contains',
  STARTS_WITH = 'starts_with',
  ENDS_WITH = 'ends_with',
  REGEX = 'regex',
  EXISTS = 'exists',
  NOT_EXISTS = 'not_exists',
}

/**
 * Logical operators
 */
export enum LogicalOperator {
  AND = 'and',
  OR = 'or',
  NOT = 'not',
}

/**
 * Sort criteria
 */
export interface SortCriteria {
  /** Field to sort by */
  field: string;
  /** Sort direction */
  direction: SortDirection;
  /** Sort priority (for multiple sorts) */
  priority?: number;
}

/**
 * Sort directions
 */
export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

/**
 * Search pagination
 */
export interface SearchPagination {
  /** Page number (0-based) */
  page: number;
  /** Items per page */
  size: number;
  /** Maximum items per page */
  maxSize?: number;
}

/**
 * Search options
 */
export interface SearchOptions {
  /** Enable fuzzy matching */
  fuzzy?: boolean;
  /** Fuzzy matching threshold (0-1) */
  fuzzyThreshold?: number;
  /** Highlight matches in results */
  highlight?: boolean;
  /** Include facets in results */
  includeFacets?: boolean;
  /** Fields to search in */
  searchFields?: string[];
  /** Fields to return */
  returnFields?: string[];
  /** Boost certain fields */
  fieldBoosts?: Record<string, number>;
}

/**
 * Search result
 */
export interface SearchResult<T = any> {
  /** The matched item */
  item: T;
  /** Relevance score (0-1) */
  score: number;
  /** Highlighted matches */
  highlights?: SearchHighlight[];
  /** Explanation of score */
  explanation?: SearchExplanation;
}

/**
 * Search highlight
 */
export interface SearchHighlight {
  /** Field that was highlighted */
  field: string;
  /** Highlighted text fragments */
  fragments: string[];
}

/**
 * Search explanation
 */
export interface SearchExplanation {
  /** Score value */
  value: number;
  /** Description of how score was calculated */
  description: string;
  /** Sub-explanations */
  details?: SearchExplanation[];
}

/**
 * Search response
 */
export interface SearchResponse<T = any> {
  /** Search results */
  results: SearchResult<T>[];
  /** Total number of matches */
  total: number;
  /** Search took (milliseconds) */
  took: number;
  /** Whether search timed out */
  timedOut: boolean;
  /** Facets (if requested) */
  facets?: SearchFacet[];
  /** Suggestions for query improvement */
  suggestions?: SearchSuggestion[];
}

/**
 * Search facet
 */
export interface SearchFacet {
  /** Facet field */
  field: string;
  /** Facet values with counts */
  values: SearchFacetValue[];
  /** Total number of unique values */
  total: number;
}

/**
 * Search facet value
 */
export interface SearchFacetValue {
  /** Facet value */
  value: any;
  /** Number of documents with this value */
  count: number;
  /** Whether this value is selected */
  selected?: boolean;
}

/**
 * Search suggestion
 */
export interface SearchSuggestion {
  /** Suggestion type */
  type: SuggestionType;
  /** Suggested text */
  text: string;
  /** Confidence score */
  score: number;
  /** Highlighted suggestion */
  highlighted?: string;
}

/**
 * Suggestion types
 */
export enum SuggestionType {
  SPELLING = 'spelling',
  COMPLETION = 'completion',
  PHRASE = 'phrase',
  TERM = 'term',
}

/**
 * Autocomplete request
 */
export interface AutocompleteRequest {
  /** Partial query */
  query: string;
  /** Field to autocomplete on */
  field?: string;
  /** Maximum suggestions */
  maxSuggestions?: number;
  /** Minimum prefix length */
  minPrefixLength?: number;
}

/**
 * Autocomplete response
 */
export interface AutocompleteResponse {
  /** Suggestions */
  suggestions: AutocompleteSuggestion[];
  /** Query that was used */
  query: string;
  /** Response time */
  took: number;
}

/**
 * Autocomplete suggestion
 */
export interface AutocompleteSuggestion {
  /** Suggested text */
  text: string;
  /** Highlighted text */
  highlighted?: string;
  /** Score/relevance */
  score: number;
  /** Additional context */
  context?: Record<string, any>;
}

/**
 * Search index configuration
 */
export interface SearchIndexConfig {
  /** Index name */
  name: string;
  /** Fields to index */
  fields: SearchFieldConfig[];
  /** Analyzer settings */
  analyzer?: SearchAnalyzerConfig;
  /** Index settings */
  settings?: SearchIndexSettings;
}

/**
 * Search field configuration
 */
export interface SearchFieldConfig {
  /** Field name */
  name: string;
  /** Field type */
  type: SearchFieldType;
  /** Whether field is searchable */
  searchable?: boolean;
  /** Whether field is facetable */
  facetable?: boolean;
  /** Whether field is sortable */
  sortable?: boolean;
  /** Field boost factor */
  boost?: number;
  /** Analyzer to use */
  analyzer?: string;
}

/**
 * Search field types
 */
export enum SearchFieldType {
  TEXT = 'text',
  KEYWORD = 'keyword',
  NUMBER = 'number',
  DATE = 'date',
  BOOLEAN = 'boolean',
  GEO_POINT = 'geo_point',
  OBJECT = 'object',
  NESTED = 'nested',
}

/**
 * Search analyzer configuration
 */
export interface SearchAnalyzerConfig {
  /** Tokenizer to use */
  tokenizer?: string;
  /** Token filters */
  filters?: string[];
  /** Character filters */
  charFilters?: string[];
}

/**
 * Search index settings
 */
export interface SearchIndexSettings {
  /** Number of shards */
  shards?: number;
  /** Number of replicas */
  replicas?: number;
  /** Refresh interval */
  refreshInterval?: string;
  /** Maximum result window */
  maxResultWindow?: number;
}
