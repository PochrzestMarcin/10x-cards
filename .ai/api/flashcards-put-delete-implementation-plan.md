# API Endpoint Implementation Plan: PUT & DELETE /flashcards/{id}

## 1. Endpoint Overview
Two endpoints for managing existing flashcards:
1. **PUT /flashcards/{id}** - Updates an existing flashcard with new content, supporting partial updates.
2. **DELETE /flashcards/{id}** - Removes a flashcard from the system.

Both endpoints enforce user ownership and proper authorization.

## 2. Request Details

### PUT /flashcards/{id}
- **HTTP Method**: PUT
- **URL**: /flashcards/{id} (Astro server endpoint → `src/pages/api/flashcards.ts`)
- **Headers**:
  - `Authorization: Bearer <JWT>` – required (Supabase Auth)
  - `Content-Type: application/json`
- **URL Parameters**:
  - `id` - Flashcard ID (number)
- **Request Body** (`FlashcardUpdateDto`):
```jsonc
{
  "front": "Updated question",     // optional, ≤ 200 chars
  "back": "Updated answer",        // optional, ≤ 500 chars
  "source": "manual"              // optional, enum("manual" | "ai-edited")
}
```
- **Parameter rules**
  1. At least one field must be provided
  2. `front` – if provided: string (1–200)
  3. `back` – if provided: string (1–500)
  4. `source` – if provided: union(`"manual" | "ai-edited"`)
  5. Cannot change source to "ai-full"
  6. Cannot modify generation_id

### DELETE /flashcards/{id}
- **HTTP Method**: DELETE
- **URL**: /flashcards/{id}
- **Headers**:
  - `Authorization: Bearer <JWT>` – required (Supabase Auth)
- **URL Parameters**:
  - `id` - Flashcard ID (number)

## 3. Used Types
| Purpose | Type | Location |
|---------|------|----------|
| Update DTO | `FlashcardUpdateDto` | `src/types.ts` |
| Response | `FlashcardDTO` | `src/types.ts` |
| Delete Response | (new) `DeleteFlashcardResponseDto` | defined in endpoint file |

## 4. Response Details

### PUT /flashcards/{id}
- **Success (200 OK)**
```jsonc
{
  "id": 1,
  "front": "Updated front",
  "back": "Updated back",
  "source": "manual",
  "generation_id": null,
  "created_at": "2024-10-15T12:00:00Z",
  "updated_at": "2024-10-15T12:30:00Z"
}
```

### DELETE /flashcards/{id}
- **Success (200 OK)**
```jsonc
{
  "message": "Flashcard deleted successfully"
}
```

- **Error Codes** (both endpoints)
  - 400 – Validation failure (PUT only: field lengths, enum mismatch)
  - 401 – Missing/invalid JWT
  - 404 – Flashcard not found or not owned by user
  - 500 – Unexpected server/database error

## 5. Data Flow

### PUT /flashcards/{id}
1. **Middleware** (`src/middleware/index.ts`) authenticates request, injects `supabase` & `user`
2. **Endpoint** `PUT /flashcards/{id}`:
   1. Parse & validate path parameter as number
   2. Parse & validate body via Zod schema (`flashcardUpdateSchema`)
   3. Fetch existing flashcard, verify ownership
   4. Update via `flashcardService.updateFlashcard()`
   5. Return updated `FlashcardDTO`

### DELETE /flashcards/{id}
1. **Middleware** handles authentication
2. **Endpoint** `DELETE /flashcards/{id}`:
   1. Parse & validate path parameter
   2. Verify flashcard exists and is owned by user
   3. Delete via `flashcardService.deleteFlashcard()`
   4. Return success message

## 6. Security Considerations
- **AuthN**: Require valid Supabase session (JWT)
- **AuthZ**: Verify flashcard ownership before updates/deletes
- **Input Validation**:
  - Path parameter must be numeric
  - PUT body validated through Zod schema
  - Use parameterized queries for SQL injection prevention
- **Error Messages**: Don't leak internal details in responses

## 7. Error Handling
| Scenario | HTTP | Message |
|----------|------|---------|
| Path parameter not numeric | 400 | "Invalid flashcard ID" |
| PUT body validation fails | 400 | Zod aggregated message |
| Flashcard not found | 404 | "Flashcard not found" |
| Not owned by user | 404 | "Flashcard not found" |
| Invalid source value | 400 | "Invalid source value" |
| DB error | 500 | "Failed to update/delete flashcard" |
| Unhandled exception | 500 | "Internal server error" |

## 8. Performance Considerations
- **Single Query Updates**: Use single UPDATE/DELETE query
- **Index Usage**: Ensure user_id index is used for ownership checks
- **Response Size**: Return minimal required data

## 9. Implementation Steps

1. **Types & Schemas**
   - Add `DeleteFlashcardResponseDto` to `src/types.ts`
   - Create/update `flashcardUpdateSchema` in `src/lib/schemas/flashcard.schema.ts`

2. **Service Layer**
   - Add to `src/lib/services/flashcard.service.ts`:
     ```typescript
     updateFlashcard(id: number, dto: FlashcardUpdateDto, userId: string)
     deleteFlashcard(id: number, userId: string)
     ```

3. **Endpoint Implementation**
   - Update `src/pages/api/flashcards.ts`:
     1. Add PUT handler with validation & service call
     2. Add DELETE handler with validation & service call
     3. Ensure proper error handling & status codes
