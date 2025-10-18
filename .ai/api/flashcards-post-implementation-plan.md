# API Endpoint Implementation Plan: POST /flashcards

## 1. Endpoint Overview

Creates one or multiple flashcards for the authenticated user. Supports both manual entries and AI-generated cards linked to a previous `generation`. Performs strict validation, bulk inserts the records, and returns the created flashcards.

## 2. Request Details

- **HTTP Method**: POST
- **URL**: /flashcards (Astro server endpoint → `src/pages/api/flashcards.ts`)
- **Headers**:
  - `Authorization: Bearer <JWT>` – required (Supabase Auth)
  - `Content-Type: application/json`
- **Request Body** (`CreateFlashcardCommand`):

```jsonc
{
  "flashcards": [
    {
      "front": "Question", // ≤ 200 chars
      "back": "Answer", // ≤ 500 chars
      "source": "manual", // enum("ai-full", "ai-edited", "manual")
      "generation_id": null, // bigint | null ( rules below )
    },
  ],
}
```

- **Parameter rules**
  1. `front` – required, string (1–200)
  2. `back` – required, string (1–500)
  3. `source` – required, union(`"manual" | "ai-full" | "ai-edited"`)
  4. `generation_id`
     - required **and** non-null when `source` is `ai-full` or `ai-edited`
     - must be `null` when `source` is `manual`
     - must reference an existing `generations.id` that belongs to the same user

## 3. Used Types

| Purpose          | Type                                | Location                 |
| ---------------- | ----------------------------------- | ------------------------ |
| Command          | `CreateFlashcardCommand`            | `src/types.ts`           |
| Item DTO         | `FlashcardCreateDto`                | `src/types.ts`           |
| Result           | `FlashcardDTO`                      | `src/types.ts`           |
| Response wrapper | (new) `CreateFlashcardsResponseDto` | defined in endpoint file |

## 4. Response Details

- **Success (201 Created)**

```jsonc
{
  "flashcards": [
    { "id": 1, "front": "…", "back": "…", "source": "manual", "generation_id": null },
    { "id": 2, "front": "…", "back": "…", "source": "ai-full", "generation_id": 123 },
  ],
}
```

- **Error Codes**
  - 400 – Validation failure (body shape, field lengths, enum mismatch, generation ownership)
  - 401 – Missing/invalid JWT
  - 404 – Provided `generation_id` not found
  - 500 – Unexpected server/database error

## 5. Data Flow

1. **Middleware** (`src/middleware/index.ts`) authenticates request, injects `supabase` & `user` into `context.locals`.
2. **Endpoint** `POST /flashcards`:
   1. Parse & validate body via Zod schema (`flashcardsCreateSchema`).
   2. Fetch `generations` only for rows where `id IN (distinct generation_id)` and `user_id = currentUser`. Ensure count matches; else 404.
   3. Map to `FlashcardInsert[]` adding `user_id`.
   4. Perform **bulk insert** into `flashcards` using `supabase.from('flashcards').insert(flashcards).select('*')`.
   5. Map result rows → `FlashcardDTO[]` and send 201.
3. **Error path**: caught errors are formatted with proper status & message, logged via `console.error` + Sentry (future).

## 6. Security Considerations

- **AuthN**: Require valid Supabase session (JWT) → 401 otherwise.
- **AuthZ**: Ensure `generation_id` (if provided) belongs to the same `user_id`.
- **Input Sanitisation**: Length checks & enum validation through Zod; Supabase parameterised queries prevent SQL injection.

## 7. Error Handling

| Scenario                               | HTTP | Message                        |
| -------------------------------------- | ---- | ------------------------------ |
| Request body missing or malformed JSON | 400  | "Invalid JSON"                 |
| Field validation fails                 | 400  | Zod aggregated message         |
| generation_id provided but not found   | 404  | "Generation not found"         |
| generation_id belongs to another user  | 400  | "Generation not owned by user" |
| DB insert error (e.g., FK fail)        | 500  | "Failed to create flashcards"  |
| Unhandled exception                    | 500  | "Internal server error"        |

## 8. Performance Considerations

- Use **bulk insert** – one round-trip instead of per-row.
- Validate input array length (e.g., limit 100) to avoid payload abuse.
- **Asynchronous processing**: Consider asynchronous data processing of generation, especially under heavy duty conditions.
- **Optimization of database queries**: Reassure, that database queries both get and insert are optimized to minimize the delays.

## 9. Implementation Steps

1. **Types**
   - If missing, add `CreateFlashcardsResponseDto` to `src/types.ts`.
2. **Schema**
   - Create `src/lib/schemas/flashcard.schema.ts` exporting `flashcardsCreateSchema` using Zod.
3. **Service**
   - Add `src/lib/services/flashcard.service.ts` with method `createFlashcards(command, userId, supabase)` encapsulating validation & insert logic.
4. **Authorization**: Add mechanism of authorization via Supabase Auth.
5. **Endpoint logic**: Implement endpoint logic, which uses the created service:
   - `src/pages/api/flashcards.ts`:
     1. `export const prerender = false;`
     2. `POST` handler: invoke service, return 201 JSON.
