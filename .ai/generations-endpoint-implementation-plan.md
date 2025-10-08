# API Endpoint Implementation Plan: POST `/generations`

## 1. Endpoint Overview
Initiate the AI flashcard generation workflow. Accepts user-supplied source text (1000-10 000 chars), triggers the AI service, stores generation metadata, and returns draft flashcards to the requester.

## 2. Request Details
- HTTP Method: **POST**
- URL: `/api/generations`  *(Astro server endpoint)*
- Headers:
  - `Authorization: Bearer <JWT>` – Supabase Auth session
  - `Content-Type: application/json`
- Body (`GenerateFlashcardsCommand`):
```jsonc
{
  "source_text": "<user provided string 1000-10000 chars>"
}
```
- Query/Path params: *none*

## 3. Used Types
- `GenerateFlashcardsCommand` – already defined in `src/types.ts`
- `FlashcardProposalDto` – already defined
- `GenerationCreateResponseDto` – already defined

## 4. Response Details
Status  | Content
------- | -------
201 Created | `GenerationCreateResponseDto`:
 ```json
 {
    "generation_id": 123,
    "draftFlashcards": [
        { "front": "Generated question", "back": "Generated Answer", "source": "ai-full" }
    ],
    "generated_count": 5
 }
 ```
400 Bad Request | `{ error: string; details?: ZodError }`
401 Unauthorized | `{ error: "unauthorized" }`
500 Internal Server Error | `{ error: string }`

## 5. Data Flow
1. **Astro API Route** (`src/pages/api/generations.post.ts`)
   - Extract `supabase` & `user` from `Astro.locals`.
   - Parse and validate body via Zod, `source_text` must have characters
2. **Service** (`src/lib/services/generation.service.ts`)
   1. `generateFlashcards(userId, sourceText)`
      - Hash source text (e.g., SHA-256) to store.
      - Pass `source_text` to external AI service in order to generate flashcard drafts.
      - Measure duration.
      - Calculates and stores metadata of generation in `generations` table (`model`, `generated_count`, `source_text_hash`, `source_text_length`, `generation_duration_ms`)
   2. Return `{ generationId, draftFlashcards, generated_count }`.
3. On AI service failure, service logs row into `generation_error_logs` and returns 500.
4. API route returns 201 JSON.

## 6. Security Considerations
- **Auth**: Require Supabase session; short-circuit 401 if `user` null.
- **Authorization**: Generation is always scoped to authenticated user ID; never allow cross-user access.
- Input size limits enforced by Zod + `Request` body size limit in Astro middleware (e.g. 20 KB).
- **Logging sensitive data**: store only hash of `source_text`, not raw text.

## 7. Error Handling

- **Incorrect input data (400)**: If `source_text` does not fit assumed length return 400 with appropriate message.
- **AI service failure(500)**: if the external service fails, catch the exception, log the error and insert row in `generation_error_logs` and return 500 error.
- **Database Error (500)**: in case of errors with db interaction, return 500 including error logging.

## 8. Performance Considerations
- **Timeout for external AI call**: Set time limit of 60 seconds for waiting for response from external AI service, not to block application resources.
- **Asynchronous processing**: Consider asynchronous data processing of generation, especially under heavy duty conditions.
- **Optimization of database queries**: Reassure, that database queries both get and insert are optimized to minimize the delays.
- **Monitoring**: Implement mechanisms for performance monitoring of the endpoint and the external AI service

## 9. Implementation Steps
1. **Routes**
   - Create `src/pages/api/generations.ts` with handler skeleton.
2. **Validation**
   - Add Zod schema `GenerateFlashcardsCommandSchema` (`source_length` 1000-10000).
3. **Service Layer**
   - Create `generation.service.ts` with `generateFlashcards` which:
     - integrates with external AI service. For the moment use mocks instead of calling real AI service.
     - Handles logic of saving to table `generations` and registers the errors in `generation_error_logs`.
4. **Authorization**: Add mechanism of authorization via Supabase Auth.
5. **Endpoint logic**: Implement endpoint logic, which uses the created service
6. **Logging & monitoring**: Add detailed logging of actions and errors