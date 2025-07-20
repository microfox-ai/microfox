import { z } from 'zod';

// Base filter value types
export type FilterValue = string | number | boolean | FilterValue[];

// Filter operators
export type FilterOperator =
  | '='
  | '!='
  | '<'
  | '<='
  | '>'
  | '>='
  | 'GLOB'
  | 'NOT GLOB'
  | 'IN'
  | 'NOT IN'
  | 'CONTAINS'
  | 'NOT CONTAINS'
  | 'HAS FIELD'
  | 'HAS NOT FIELD';

// Boolean operators
export type BooleanOperator = 'AND' | 'OR';

// Base filter condition
export interface FilterCondition {
  field: string;
  operator: FilterOperator;
  value: FilterValue;
}

// Compound filter with boolean operators
export interface CompoundFilter {
  operator: BooleanOperator;
  filters: (FilterCondition | CompoundFilter)[];
}

// Union type for all possible filters
export type Filter = FilterCondition | CompoundFilter | string;

// Zod schemas for validation
export const FilterValueSchema: z.ZodType<FilterValue> = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.array(z.lazy(() => FilterValueSchema)),
]);

export const FilterConditionSchema: z.ZodType<FilterCondition> = z.object({
  field: z.string(),
  operator: z.enum([
    '=',
    '!=',
    '<',
    '<=',
    '>',
    '>=',
    'GLOB',
    'NOT GLOB',
    'IN',
    'NOT IN',
    'CONTAINS',
    'NOT CONTAINS',
    'HAS FIELD',
    'HAS NOT FIELD',
  ]),
  value: FilterValueSchema,
});

export const CompoundFilterSchema: z.ZodType<CompoundFilter> = z.object({
  operator: z.enum(['AND', 'OR']),
  filters: z.array(
    z.lazy(() => z.union([FilterConditionSchema, CompoundFilterSchema]))
  ),
});

export const FilterSchema: z.ZodType<Filter> = z.union([
  FilterConditionSchema,
  CompoundFilterSchema,
  z.string(),
]);

/**
 * Converts a filter value to its string representation for Upstash Vector
 */
function valueToString(value: FilterValue): string {
  if (typeof value === 'string') {
    // Escape single quotes and wrap in single quotes
    return `'${value.replace(/'/g, "''")}'`;
  }
  if (typeof value === 'number') {
    return value.toString();
  }
  if (typeof value === 'boolean') {
    return value ? '1' : '0';
  }
  if (Array.isArray(value)) {
    return `(${value.map((v) => valueToString(v)).join(', ')})`;
  }
  throw new Error(`Unsupported filter value type: ${typeof value}`);
}

/**
 * Converts a filter condition to its string representation
 */
function conditionToString(condition: FilterCondition): string {
  const { field, operator, value } = condition;

  // Validate field name format
  if (!/^[a-zA-Z_][a-zA-Z_0-9.[\]#-]*$/.test(field)) {
    throw new Error(
      `Invalid field name: ${field}. Field names must start with a letter or underscore and can contain letters, numbers, dots, brackets, and hyphens.`
    );
  }

  switch (operator) {
    case 'HAS FIELD':
    case 'HAS NOT FIELD':
      return `${operator} ${field}`;
    case 'IN':
    case 'NOT IN':
      if (!Array.isArray(value)) {
        throw new Error(`${operator} operator requires an array value`);
      }
      return `${field} ${operator} ${valueToString(value)}`;
    case 'CONTAINS':
    case 'NOT CONTAINS':
      return `${field} ${operator} ${valueToString(value)}`;
    case 'GLOB':
    case 'NOT GLOB':
      if (typeof value !== 'string') {
        throw new Error(`${operator} operator requires a string value`);
      }
      return `${field} ${operator} ${valueToString(value)}`;
    default:
      return `${field} ${operator} ${valueToString(value)}`;
  }
}

/**
 * Converts a compound filter to its string representation
 */
function compoundFilterToString(filter: CompoundFilter): string {
  const { operator, filters } = filter;

  if (filters.length === 0) {
    throw new Error('Compound filter must have at least one sub-filter');
  }

  if (filters.length === 1) {
    return filterToString(filters[0]);
  }

  const filterStrings = filters.map((f) => {
    const str = filterToString(f);
    // Add parentheses around compound filters to ensure proper precedence
    return f.hasOwnProperty('operator') ? `(${str})` : str;
  });

  return filterStrings.join(` ${operator} `);
}

/**
 * Converts any filter type to its string representation
 */
export function filterToString(filter: Filter): string {
  if (typeof filter === 'string') {
    return filter;
  }

  if ('operator' in filter && 'filters' in filter) {
    return compoundFilterToString(filter);
  }

  if ('field' in filter && 'operator' in filter && 'value' in filter) {
    return conditionToString(filter);
  }

  throw new Error('Invalid filter format');
}

/**
 * Validates a filter object using Zod schema
 */
export function validateFilter(filter: Filter): Filter {
  return FilterSchema.parse(filter);
}

/**
 * Helper functions for creating common filter conditions
 */
export const FilterHelpers = {
  // Equality operators
  eq: (field: string, value: FilterValue): FilterCondition => ({
    field,
    operator: '=',
    value,
  }),

  ne: (field: string, value: FilterValue): FilterCondition => ({
    field,
    operator: '!=',
    value,
  }),

  // Comparison operators
  lt: (field: string, value: number): FilterCondition => ({
    field,
    operator: '<',
    value,
  }),

  lte: (field: string, value: number): FilterCondition => ({
    field,
    operator: '<=',
    value,
  }),

  gt: (field: string, value: number): FilterCondition => ({
    field,
    operator: '>',
    value,
  }),

  gte: (field: string, value: number): FilterCondition => ({
    field,
    operator: '>=',
    value,
  }),

  // String operators
  glob: (field: string, pattern: string): FilterCondition => ({
    field,
    operator: 'GLOB',
    value: pattern,
  }),

  notGlob: (field: string, pattern: string): FilterCondition => ({
    field,
    operator: 'NOT GLOB',
    value: pattern,
  }),

  // Array operators
  in: (field: string, values: FilterValue[]): FilterCondition => ({
    field,
    operator: 'IN',
    value: values,
  }),

  notIn: (field: string, values: FilterValue[]): FilterCondition => ({
    field,
    operator: 'NOT IN',
    value: values,
  }),

  contains: (field: string, value: FilterValue): FilterCondition => ({
    field,
    operator: 'CONTAINS',
    value,
  }),

  notContains: (field: string, value: FilterValue): FilterCondition => ({
    field,
    operator: 'NOT CONTAINS',
    value,
  }),

  // Field existence operators
  hasField: (field: string): FilterCondition => ({
    field,
    operator: 'HAS FIELD',
    value: true, // Value is ignored for this operator
  }),

  hasNotField: (field: string): FilterCondition => ({
    field,
    operator: 'HAS NOT FIELD',
    value: true, // Value is ignored for this operator
  }),

  // Boolean operators
  and: (...filters: (FilterCondition | CompoundFilter)[]): CompoundFilter => ({
    operator: 'AND',
    filters,
  }),

  or: (...filters: (FilterCondition | CompoundFilter)[]): CompoundFilter => ({
    operator: 'OR',
    filters,
  }),
};

/**
 * Type-safe filter builder for nested objects
 */
export class FilterBuilder {
  private conditions: (FilterCondition | CompoundFilter)[] = [];

  eq(field: string, value: FilterValue): this {
    this.conditions.push(FilterHelpers.eq(field, value));
    return this;
  }

  ne(field: string, value: FilterValue): this {
    this.conditions.push(FilterHelpers.ne(field, value));
    return this;
  }

  lt(field: string, value: number): this {
    this.conditions.push(FilterHelpers.lt(field, value));
    return this;
  }

  lte(field: string, value: number): this {
    this.conditions.push(FilterHelpers.lte(field, value));
    return this;
  }

  gt(field: string, value: number): this {
    this.conditions.push(FilterHelpers.gt(field, value));
    return this;
  }

  gte(field: string, value: number): this {
    this.conditions.push(FilterHelpers.gte(field, value));
    return this;
  }

  glob(field: string, pattern: string): this {
    this.conditions.push(FilterHelpers.glob(field, pattern));
    return this;
  }

  notGlob(field: string, pattern: string): this {
    this.conditions.push(FilterHelpers.notGlob(field, pattern));
    return this;
  }

  in(field: string, values: FilterValue[]): this {
    this.conditions.push(FilterHelpers.in(field, values));
    return this;
  }

  notIn(field: string, values: FilterValue[]): this {
    this.conditions.push(FilterHelpers.notIn(field, values));
    return this;
  }

  contains(field: string, value: FilterValue): this {
    this.conditions.push(FilterHelpers.contains(field, value));
    return this;
  }

  notContains(field: string, value: FilterValue): this {
    this.conditions.push(FilterHelpers.notContains(field, value));
    return this;
  }

  hasField(field: string): this {
    this.conditions.push(FilterHelpers.hasField(field));
    return this;
  }

  hasNotField(field: string): this {
    this.conditions.push(FilterHelpers.hasNotField(field));
    return this;
  }

  and(): Filter {
    if (this.conditions.length === 0) {
      throw new Error('No conditions to combine with AND');
    }
    if (this.conditions.length === 1) {
      return this.conditions[0];
    }
    return FilterHelpers.and(...this.conditions);
  }

  or(): Filter {
    if (this.conditions.length === 0) {
      throw new Error('No conditions to combine with OR');
    }
    if (this.conditions.length === 1) {
      return this.conditions[0];
    }
    return FilterHelpers.or(...this.conditions);
  }

  build(): Filter {
    return this.and();
  }

  toString(): string {
    return filterToString(this.build());
  }
}

/**
 * Creates a new filter builder instance
 */
export function createFilter(): FilterBuilder {
  return new FilterBuilder();
}
