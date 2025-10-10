# View Implementation Plan: Flashcard Generation

## 1. Overview

The view allows the user to enter text (1000-10000 characters) and send it to the API to generate flashcard suggestions by AI. The user can then view, approve, edit, or reject the generated flashcard suggestions. Finally, they can save all or only the accepted flashcards to the database.

##2. View routing

The view should be accessible under the path `/generate`.

## 3. Component structure

**FlashcardGenerationView** - the main component of the view containing the logic and structure of the page.
 - **TextInputArea** - text input field component for pasting text.
 - **GenerateButton** - button initiating the flashcard generation process.
 - **FlashcardList** - list displaying flashcard suggestions received from the API.
  - **FlashcardListItem** - a single list item representing one flashcard suggestion.
 - **SkeletonLoader** - loading indicator component (skeleton), displayed while waiting for the API response.
 - **BulkSaveButton** - buttons for saving all flashcards or only accepted ones.
 - **ErrorNotification** - a component for displaying error messages.

## 4. Component Details

### `FlashcardGenerationView`
- **Description**: Main view, which integrates all component required for flashcards generation and review.
- **Elements**: Text field, generate button, list of flashcards, loader and error messages
- **Handled Events**: Value change in text field, generate button click, interactions with flashcards (acceptance, edit, reject), save button click
- **Validation Rules**: The text must have length between 1000 and 10000 characters.
- **Types**: Uses `GenerateFlashcardsCommand` and `GenerationCreateResponseDto`
- **Propsy**: Can get optional functions of callback to confirm saving or rerouting after saving.

### `TextInputArea`
- **Description**: Component that allows user to input text.
- **Elements**: Text area with placeholder and label.
- **Handled Events**: onChange to update text value state
- **Validation Rules**: The text must have length between 1000 and 10000 characters - live checking.
- **Types**: Local string state, `GenerateFlashcardsCommand` for sending
- **Propsy**: value, onChange, placeholder

### `GenerateButton`
- **Description**: Button which starts the flashcards generation process
- **Elements**: HTML button with label "Generate flashcards".
- **Handled Events**: onClick, which triggers function calling the api request
- **Validation Rules**: Active only if value in test area matches the length requirements
- **Types**: Callback function on click.
- **Propsy**: onClick, disabled (depending upon validation status)

### `FlashcardList`
- **Description**: Component which shows the list of flashcards proposals retrieved from API.
- **Elements**: List (ie. ul/li or grid components) containing FlashcardListItem
- **Handled Events**: Passing events to particular flashcard items (accept, edit, reject)
- **Validation Rules**: None - data coming from API are already validated.
- **Types**: Array of objects of tyle `FlashcardProposalDTO`
- **Propsy**: flashcards (list of proposals), onAccept, onEdit, onReject

### `FlashcardListItem`
- **Description**: Single flashcard showing one proposal of a flashcard.
- **Elements**: Text for `front` and `back` and three buttons: "Approve", "Edit", "Reject" 
- **Handled Events**: onClick for each button, which modifies the state of given flashcard (ie. mark as approved, opening edit mode, removal from list)
- **Validation Rules**: If edit is active, the entered data must fulfill conditions: `front` length <= 200 characters, `back` length <= 500 characters.
- **Types**: `FlashcardProposalViewModel`, extended local type with flag accepted/edited.
- **Propsy**: flashcard (proposal data), onAccept, onEdit, onReject

### `SkeletonLoader`
- **Description**: Komponent that visualises data loading (skeleton)
- **Elements**: UI Template (skeleton) imitating cards structure, which will be presented.
- **Handled Events**: No user interactions
- **Validation Rules**: Not applicable
- **Types**: Stateless
- **Propsy**: Can accept optional styling parameters.

### `ErrorNotification`
- **Description**: Komponent that visualises error messages (ie. API errors of form validation messages)
- **Elements**: Text message with error icon.
- **Handled Events**: None - pure information component
- **Validation Rules**: Passed message shouldn't be empty
- **Types**: String (error message)
- **Propsy**: message, optional error type

### `BulkSaveButton`
- **Description**: A component allowing to save all generated flashcards to the database or only those ones that were accepted. It allows to send data to backend API in one request.
- **Elements**: Contains "Save All" and "Save Accepted" buttons.
- **Handled Events**: `onClick` for each button, which will trigger a callback function to save the appropriate flashcards.
- **Validation Rules**: "Save Accepted" button should be disabled if no flashcards are marked as accepted. "Save All" should be disabled if there are no generated flashcards. The button should be disable if atleast one flashcards contains valdation errors
- **Types**: Uses types defined in `types.ts`, including interface `FlashcardsCreateCommand` (basing on `FlashcardCreateDto`)
- **Propsy**: `onSaveAccepted`, `onSaveAll`, `disabled`.

## 5. Types

- **GenerateFlashcardsCommand**: { source_text: string } - sent to `/generations` api endpoint.
- **GenerationCreateResponseDto**: { generation_id: number, draft_flashcards: FlashcardProposalDto[], generated_count: number } - structure of API response.
- **FlashcardProposalDto**: { front: string, back: string, source: "ai-full" } - single flashcard proposal
- **CreateFlashcardCommand**: `{ flashcards: FlashcardCreateDto[] }` - request body sent to `POST /flashcards` endpoint.
- **FlashcardCreateDto**: `{ front: string; back: string; source: 'ai-full' | 'ai-edited' | 'manual'; generation_id: number | null; }` - structure for a single flashcard to be created.
- **CreateFlashcardsResponseDto**: `{ flashcards: FlashcardDTO[] }` - structure of the response from the `POST /flashcards` endpoint.
- **FlashcardProposalViewModel**: A client-side view model that extends `FlashcardProposalDto` to manage the UI state for each flashcard suggestion.
  { front: string, back: string, source: "ai-full" | "ai-edited" , accepted: boolean, edited: boolean }. It allows to define the source state that will be sent to the API `/flashcards` endpoint.

## 6. State Management
View state will be managed by React hooks (useState, useEffect). Key states:
- Text field value (textValue).
- Loading status (isLoading) for API calls.
- Error status (errorMessage) for error messages.
- List of flashcard suggestions, along with their local flags (e.g. accepted,
edited).
- Optional status for flashcard editing mode.
It is possible to create a custom hook (e.g. useGenerateFlashcards) to handle ΑΡΙ logic.

## 7. API integration
Integration with endpoint:
- **POST /generations**: We send the { source_text } object and receive a response
containing generation_id, flashcards_proposals and generated_count.
- Response validation: check HTTP status, handle 400 (validation) and 500 (server error) errors.
- After accepting the proposal, we call POST /flashcards to save the flashcards, passing a properly formatted array of objects (with additional validations front ≤200, back ≤500, source, generation_id according to types).

- **POST /flashcards**
- **Description**: Saves the generated and accepted flashcards to the database.
- **Request Body**: `CreateFlashcardCommand`. The `flashcards` array will be constructed from the local state.
  - The `source` property will be determined based on the `FlashcardProposalViewModel`: if `edited` is `true`, the source is `'ai-edited'`; otherwise, it is `'ai-full'`.
- **Response**: `CreateFlashcardsResponseDto`, containing the newly created flashcards with their database IDs.
- **Error Handling**: The application should handle potential 400 (validation) and 500 (server) errors and display an appropriate message to the user.

## 8. User interactions
The user pastes text into the text field.
- After clicking the ‘Generate flashcards’ button:
 - Text length validation begins.
 - If the validation is successful, a request is sent to the API.
 - While waiting, SkeletonLoader is displayed and the button is deactivated.
- After receiving a response, the FlashcardListItem list is displayed.
- Each card allows you to:
 - Approve the suggestion, which marks the flashcard for saving.
 - Editing by opening the edit mode with the option to correct the text with validation.
 - Rejecting by removing the suggestion from the list.
- The BulkSaveButton component allows you to send selected flashcards to be saved in the database (API POST /flashcards call).

## 9. Conditions and validation
- Text field: the text must be between 1,000 and 10,000 characters long. 
- When editing a flashcard: front 200 characters, back ≤ 500 characters.
- The generate button is only activated when the text has been correctly validated. 
- API response validation: error messages displayed in ErrorNotification.

## 10. Error handling
- Displaying error messages in case of form validation failure.
- API error handling (status 400 and 500): displaying appropriate messages and allowing the request to be resubmitted.
- If saving flashcards fails, the loading status is reset and the user is informed of the error.

## 11. Implementation steps
1. Create a new `/generate` view page in the Astro structure.
2. Implement the main `FlashcardGenerationView` component.
3. Create a `TextInputArea` component with text length validation.
4. Create a `GenerateButton` component and connect the request sending action to POST /generations.
5. Implement a hook (e.g. useGenerateFlashcards) to handle API logic and state management.
6. Create a `SkeletonLoader` component to visualise loading.
7. Create `FlashcardList` and `FlashcardListItem` components with action handling (approve, edit, reject).
8. Integration of error message display via `ErrorNotification`.
9. Implementation of the `BulkSaveButton` component, which will collectively send a request to the POST `/flashcards` endpoint using data `CreateFlashcardCommand` validation type .
10. Testing user interaction and validation (correct and incorrect scenarios).
11. Fine-tuning responsiveness and improving accessibility aspects.
12. Final code review and refactoring before implementation.