# API Endpoint Implementation Plan: GET /flashcards

## 1. Endpoint Overview
Retrieves a paginated, filtered, and sortable list of flashcards for the authenticated user. Supports flexible querying through URL parameters for pagination, sorting, and filtering. Returns both the flashcard data and pagination metadata.

## 2. Request Details
- **HTTP Method**: GET
- **URL**: /flashcards (Astro server endpoint → `src/pages/api/flashcards.ts`)
- **Headers**:
  - `Authorization: Bearer <JWT>` – required (Supabase Auth)
- **Query Parameters**:
  1. `page` (optional)
     - Type: number
     - Default: 1
     - Validation: positive integer
  2. `limit` (optional)
     - Type: number
     - Default: 10
     - Validation: positive integer, max 100
  3. `sort` (optional)
     - Type: string
     - Default: 'created_at'
     - Allowed values: ['created_at', 'source']
  4. `order` (optional)
     - Type: string
     - Default: 'desc'
     - Allowed values: ['asc', 'desc']

## 3. Used Types
| Purpose | Type | Location |
|---------|------|----------|
| Response Item | `FlashcardDTO` | `src/types.ts` |
| Pagination | `PaginationDto` | `src/types.ts` |
| Response | `PaginatedFlashcardsResponseDTO` | `src/types.ts` |
| Query Schema | (new) `FlashcardsListQuerySchema` | `src/lib/schemas/flashcard.schema.ts` |

## 4. Response Details
- **Success (200 OK)**
```jsonc
{
  "data": [
    {
      "id": 1,
      "front": "Question",
      "back": "Answer",
      "source": "manual",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "generation_id": null
    }
    // ... more items
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42
  }
}
```
- **Error Codes**
  - 400 – Invalid query parameters
  - 401 – Missing/invalid JWT
  - 500 – Unexpected server/database error

## 5. Data Flow
1. **Middleware** (`src/middleware/index.ts`) authenticates request, injects `supabase` & `user` into `context.locals`.
2. **Endpoint** `GET /flashcards`:
   1. Parse & validate query parameters via Zod schema (`flashcardsListQuerySchema`).
   2. Calculate offset from page & limit.
   3. Build base query with user filter: `supabase.from('flashcards').select('*', { count: 'exact' }).eq('user_id', userId)`.
   4. Apply optional filters:
      - `.eq('source', query.source)` if source provided
      - `.eq('generation_id', query.generation_id)` if generation_id provided
   5. Apply sorting: `.order(query.sort, { ascending: query.order === 'asc' })`.
   6. Apply pagination: `.range(offset, offset + limit - 1)`.
   7. Execute query, destructure `{ data, count }`.
   8. Map data → `FlashcardDTO[]` and construct pagination metadata.
   9. Return 200 with `PaginatedFlashcardsResponseDTO`.
3. **Error path**: caught errors are formatted with proper status & message, logged via `console.error` + Sentry (future).

## 6. Security Considerations
- **AuthN**: Require valid Supabase session (JWT) → 401 otherwise.
- **AuthZ**: Row Level Security (RLS) ensures users can only access their own flashcards.
- **Input Sanitisation**: 
  - Strict validation of sort columns prevents SQL injection
  - Pagination limits prevent resource exhaustion
  - Query parameter validation through Zod schema
- **Data Access**:
  - Use parameterized queries for all filters
  - Validate sort column names against whitelist

## 7. Error Handling
| Scenario | HTTP | Message |
|----------|------|---------|
| Invalid page/limit (non-positive) | 400 | "Invalid pagination parameters" |
| Invalid sort column | 400 | "Invalid sort column" |
| Invalid order direction | 400 | "Invalid sort order" |
| Invalid source enum value | 400 | "Invalid source filter" |
| Invalid generation_id format | 400 | "Invalid generation ID" |
| Missing/invalid JWT | 401 | "Unauthorized" |
| Database query error | 500 | "Failed to fetch flashcards" |
| Unhandled exception | 500 | "Internal server error" |

## 8. Performance Considerations
- **Query Optimization**:
  - Use `count: 'exact'` only on first page load
  - Leverage database indexes on sort columns
- **Response Size**:
  - Enforce reasonable page size limits

## 9. Implementation Steps
1. **Schema**
   - Add `flashcardsListQuerySchema` to `src/lib/schemas/flashcard.schema.ts`
   - Define allowed sort columns and validation rules

2. **Service**
   - Create/update `src/lib/services/flashcard.service.ts`
   - Add `listFlashcards(query, userId, supabase)` method
   - Implement query building and result mapping logic

3. **Endpoint**
   - Update `src/pages/api/flashcards.ts`:
     1. Add `export const prerender = false;`
     2. Implement `GET` handler using service
     3. Add error handling and response formatting
