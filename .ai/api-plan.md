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

- **POST `/generations`**
  - **Description**: Initiate the AI generation process for flashcards drafts generation based on user-provided text.
  - **Request JSON**:
    ```json
    {
      "source_text": "<User provided source text between 1000-10000 chars>"
    }
    ```
  - **Business Logic**:
    - Validate that `source_text` length is between 1000 and 10000 characters.
    - Call the AI service to generate flashcards drafts.
    - Store the generation metadata and return generated flashcards drafts to the user.
  - **JSON Response**:
    ```json
    {
      "generationId": 15,
      "draftFlashcards": [
        { "front": "Generated Question", "back": "Generated Answer", "source": "ai-full" }
      ],
      "generated_count": 5
    }
    ```
  - **Validations**:
    - `source_text` length must be between 1000-10000 characters
  - **Errors**:
    - 400 Bad Request for invalid inputs.
    - 401 Unauthorized if token is invalid.
    - 500 AI service errors (logs recorded in `generation_error_logs`).

- **GET `/generations`**
  - **Description**: Retrieve list of past generation requests for the authenticated user (supports pagination)
  - **Query Parameters**:
    - `page` (default: 1)
    - `limit` (default: 10)
  - **JSON Response** List of generation objects with metadata
  - **Errors**: 401 Unauthorized if token is invalid

- **GET `/generations/{id}`**
  - **Description**: Get detailed information about a specific generation including its flashcards
  - **JSON Response**: Generation details and associated flashcards
  - **Errors**:
    - 401 Unauthorized if token is invalid
    - 404 Not Found if generation not found


### 2.3 Generation Error Logs (admin only)

- **GET `/generation-error-logs`**
  - **Description**: Retrieve error logs from generation attempts (admin only)
  - **JSON Response**: List of error log objects
  - **Errors**:
    - 401 Unauthorized if token is invalid
    - 403 Forbidden if user is not admin

## 3. Authentication & Authorization
- Users authenticate via `/auth/login` or `/auth/register`, receiving bearer token.
- Supabase Auth issues JWT (RS256). Clients include `Authorization: Bearer <token>`.
- Protected endpoints require the token in the `Authorization` header.
- Each request validates token, extracts `user.id`. Row-level security (RLS) in PostgreSQL additionally enforces `user_id = auth.uid()`.
- **Additional Information**: Use https, rate limiting, and secure error messaging to mitigate security risks.

## 4. Validation & Business Logic
### 4.1 **Flashcards** Validation

 - `front`: required, ≤200 chars
 - `back`: required, ≤500 chars
 - `source`: enum { ai-full, ai-edited, manual }

Additional: user can update/delete only own flashcards.

### 4.2 **Generation** Validation

 - `source_text`: 1000-10000 characters
 - `source_text_hash`: 1000-10000 characters

**Business Logic Implementation**:

- **AI Generation**:
 - Validate inputs and call the AI service upon POST `/generations`
 - Record generation metadata (model, generated_count, duration) and persist generated flashcards
 - Log any errors in `generation_error_logs` for auditing and debugging.
- **Flashcard management**:
 - Automatic update of the `updated_at` field via database triggers when flashcards are modified.