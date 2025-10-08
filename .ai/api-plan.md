# REST API Plan

## 1. Resources

- **Users**
  - *Db table*: `users`
  - Managed through Supabase Auth; operations such as registration and login may be handled by Supabase or custom endpoints if needed

- **Flashcards**
  - *Db table*: `flashcards`
  - Fields include: `id`, `front`, `back`, `source`, `created_at`, `updated_at`, `generation_id`, `user_id`

- **Generations**
  - *Db table*: `generations`
  - Stores metadata and results of AI generation requests (`model`, `generated_count`, `source_text_hash`, `source_text_length`, `generation_duration`).

- **Generation Error Logs**
  - *Db table*: `generation_error_logs`
  - Used for logging errors encountered during AI flash cards generation.

## 2. Endpoints
(All paths are prefixed with `/api`, are JSON-only, and require a valid Supabase JWT unless noted.)

### 2.1 Flashcards

- **GET `/flashcards`**
  - **Description**: Retrieve flashcards (paginated, filtered and sortable list for authenticated user)
  - **Query Parameters**:
    - `page` (default: 1)
    - `limit` (default: 10)
    - `sort` (e.g., `created_at`)
    - `order` (`asc`, `desc`)
    - filters (e.g., `source`, `generation_id`)
  - **JSON Response**
    ```json
    {
      "data": [
        { "id": 1, "front": "Question or Task", "back": "Answer", "source": "manual", "created_at": "date", "updated_at": "date"}
      ],
      "pagination": { "page": 1, "limit": 10, "total": 100 }
    }
    ```
  - **Errors**: 401 Unathorized if token is invalid

- **GET `/flashcards/{id}`**
  - **Description**: Retrieve details for a specific flashcard.
  - **JSON Response**: Flashcard object
  - **Errors**: 401 Unathorized if token is invalid, 404 Not Found

- **POST `/flashcards`**
  - **Description**: Create one or multiple flashcards (manually or from AI generation).
  - **Request JSON**:
    ```json
    {
      "flashcards": [
        {
          "front": "Question",
          "back": "Answer",
          "source": "manual",
          "generation_id": null
        },
        {
          "front": "Another Question",
          "back": "Another Answer",
          "source": "ai-full",          
          "generation_id": 123
        }
      ],
    }
    ```
  - **JSON Response**: Array of created flashcard objects including their IDs.
    ```json
    {
      "flashcards": [
        { "id": 1, "front": "Question 1", "back": "Answer 1", "source": "manual", "generation_id": null },
        { "id": 2, "front": "Question 2", "back": "Answer 2", "source": "ai-full", "generation_id": 123 },
      ]
    }
    ```
  - **Validations**: 
    - `front` maximum length: 200 characters
    - `back` maximum length: 500 characters
    - `source` Must be one of `ai-full`, `ai-edited` or `manual`
    - `generation_id` Required when source is `ai-full` or `ai-edited`, must be null for `manual` source
  - **Errors**: 
    - 400 for invalid inputs, including validation errors for any flashcard in the array

- **PUT `/flashcards/{id}`**
  - **Description**: Edit existing flashcard.
  - **Request JSON**: Fields to update
  - **JSON Response**: Updated flashcard object.
  - **Validations**: 
    - `front` maximum length: 200 characters
    - `back` maximum length: 500 characters
    - `source` Must be one of `ai-edited` or `manual`
  - **Errors**: 404 if flashcard not found, 401 unauthorized

- **DELETE `/flashcards/{id}`**
  - **Description**: Deletes a flashcard.  
  - **JSON Response**: Success message.
  - **Errors**: 404 if flashcard not found, 401 unauthorized

### 2.2 Generations
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/generations` | Submit source text to LLM; returns draft flashcards |
| GET | `/api/generations` | List past generations |
| GET | `/api/generations/{id}` | Generation details incl. accepted stats |
| PUT | `/api/generations/{id}/accept` | Accept/modify generated cards & persist |

POST `/api/generations` body:
```json
{
  "model": "openrouter/mistral-7b",
  "text": "<source text between 1000-10000 chars>"
}
```
Response `202 Accepted`:
```json
{
  "generationId": 15,
  "draftFlashcards": [ { "front": "…", "back": "…" } ],
  "status": "processing" // polling via /{id}
}
```
PUT `/accept` body:
```json
{
  "flashcards": [
     { "front": "…", "back": "…", "action": "accept" },
     { "front": "…", "back": "…", "action": "edit" },
     { "index": 3, "action": "reject" }
  ]
}
```

### 2.4 Generation Error Logs (admin only)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/generation-error-logs` | List error logs with filters |

### 2.5 Study Session *(MVP placeholder – external algorithm)*
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/study-session/next` | Get next due flashcard |
| POST | `/api/study-session/{flashcardId}/review` | Submit recall quality (1-5) |

## 3. Authentication & Authorization
- Supabase Auth issues JWT (RS256). Clients include `Authorization: Bearer <token>`.
- Each request validates token, extracts `user.id`. Row-level security (RLS) in PostgreSQL additionally enforces `user_id = auth.uid()`.
- Endpoints under `/api/admin/*` require `role=admin` claim.
- Rate limiting: 120 req/minute per user via Astro middleware.

## 4. Validation & Business Logic
### 4.1 Flashcard Validation
| Field | Rule |
|-------|------|
| front | required, ≤200 chars |
| back | required, ≤500 chars |
| source | enum { ai-full, ai-edited, manual } |

Additional: user can update/delete only own flashcards.

### 4.2 Generation Validation
| Field | Rule |
|-------|------|
| text length | 1000-10000 characters |
| model | required, known whitelist |

Business Logic:
1. POST /generations queues async LLM call; statistics (`generated_count`, duration) saved.
2. PUT /generations/{id}/accept updates success metrics (`accepted_unedited_count`, `accepted_edited_count`) and creates flashcards in bulk within transaction.
3. Study-session endpoints call external spaced-repetition library; scheduling data stored client-side for MVP or in future `reviews` table.

Error Handling:
- Validation errors → `400` with details array.
- Async LLM failures logged into `generation_error_logs`; surfaces `500` to user with correlation id.

Security Measures:
- HTTPS only, HSTS.
- Content-Type: application/json; size limit 1 MB.
- SQL injection prevented via Supabase SDK.
- CORS allow-list origins.

Pagination Format:
```json
{
  "items": [/* … */],
  "page": 1,
  "perPage": 20,
  "total": 135
}
```

---
*Assumptions:*
- Study-session uses separate library; minimal endpoints included.
- Registration/login handled through Supabase but exposed for convenience.
- Admin endpoints restricted via JWT `role` claim.
