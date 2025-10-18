# View Implementation Plan: My Flashcards

## 1. Overview

The My Flashcards view allows users to manage their saved flashcards through a paginated table interface. Users can view, edit, and delete existing flashcards, as well as create new ones manually. The view supports filtering by source and includes a modal for editing/creating flashcards.

## 2. View Routing

The view should be accessible under the path `/flashcards` and requires authentication.

## 3. Component Structure

**FlashcardsPage** (Astro)
└── **FlashcardsView** (React)
├── **FilterBar**
│ ├── SourceFilter
│ └── CreateButton
├── **FlashcardsTable**
│ └── FlashcardRow
├── **FlashcardModal**
└── **DeleteConfirmationDialog**

## 4. Component Details

### `FlashcardsPage`

- **Description**: Astro page component that serves as the container for the React components
- **Elements**: Authentication check, FlashcardsView component
- **Validation**: Redirects to login if user is not authenticated
- **Types**: None (Astro component)
- **Props**: None

### `FlashcardsView`

- **Description**: Main React component managing the flashcards list and state
- **Elements**: FilterBar, FlashcardsTable, FlashcardModal, DeleteConfirmationDialog
- **Handled Events**: Page changes, sort changes, filter changes
- **Validation**: Ensures valid pagination and sort parameters
- **Types**: Uses FlashcardsTableState, FlashcardViewModel
- **Props**: None

### `FilterBar`

- **Description**: Contains filtering controls and create button
- **Elements**:
  - Source filter dropdown (shadcn/ui Select)
  - "Create Flashcard" button (shadcn/ui Button)
- **Handled Events**: Source selection change, create button click
- **Validation**: None
- **Types**: Uses FlashcardSource
- **Props**:
  ```typescript
  {
    selectedSource: FlashcardSource | null;
    onSourceChange: (source: FlashcardSource | null) => void;
    onCreateClick: () => void;
  }
  ```

### `FlashcardsTable`

- **Description**: Displays flashcards in a paginated table format
- **Elements**:
  - Table with sortable columns
  - Pagination controls
  - Action buttons per row
- **Handled Events**:
  - Column header clicks (sorting)
  - Page navigation
  - Edit/delete button clicks
- **Validation**: None
- **Types**: Uses FlashcardViewModel[], PaginationDto
- **Props**:
  ```typescript
  {
    flashcards: FlashcardViewModel[];
    pagination: PaginationDto;
    sort: { column: string; order: 'asc' | 'desc' };
    onSort: (column: string) => void;
    onPageChange: (page: number) => void;
    onEdit: (flashcard: FlashcardViewModel) => void;
    onDelete: (flashcard: FlashcardViewModel) => void;
  }
  ```

### `FlashcardModal`

- **Description**: Modal for editing or creating flashcards
- **Elements**:
  - Form with front/back fields
  - Save/Cancel buttons
  - Validation messages
- **Handled Events**:
  - Form submission
  - Field changes
  - Modal close
- **Validation**:
  - Front: Required, ≤200 chars
  - Back: Required, ≤500 chars
- **Types**: Uses FlashcardViewModel, FlashcardUpdateDto
- **Props**:
  ```typescript
  {
    isOpen: boolean;
    mode: 'create' | 'edit';
    flashcard: FlashcardViewModel | null;
    onSave: (flashcard: FlashcardUpdateDto) => Promise<void>;
    onClose: () => void;
  }
  ```

### `DeleteConfirmationDialog`

- **Description**: Confirmation dialog for flashcard deletion
- **Elements**:
  - Confirmation message
  - Confirm/Cancel buttons
- **Handled Events**: Confirm/cancel clicks
- **Validation**: None
- **Types**: Uses FlashcardViewModel
- **Props**:
  ```typescript
  {
    isOpen: boolean;
    flashcard: FlashcardViewModel | null;
    onConfirm: () => Promise<void>;
    onCancel: () => void;
  }
  ```

## 5. Types

```typescript
interface FlashcardViewModel extends FlashcardDTO {
  isEditing: boolean;
  validationErrors?: {
    front?: string;
    back?: string;
  };
}

interface FlashcardsTableState {
  items: FlashcardViewModel[];
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  sortColumn: string;
  sortOrder: "asc" | "desc";
  sourceFilter: FlashcardSource | null;
}

interface ModalState {
  isOpen: boolean;
  mode: "create" | "edit";
  flashcard: FlashcardViewModel | null;
}

interface DeleteDialogState {
  isOpen: boolean;
  flashcard: FlashcardViewModel | null;
}
```

## 6. State Management

### Custom Hooks

#### `useFlashcards`

```typescript
interface UseFlashcardsReturn {
  flashcards: FlashcardViewModel[];
  pagination: PaginationDto;
  isLoading: boolean;
  error: Error | null;
  setPage: (page: number) => void;
  setSort: (column: string) => void;
  setSourceFilter: (source: FlashcardSource | null) => void;
  refresh: () => Promise<void>;
}
```

#### `useFlashcardModal`

```typescript
interface UseFlashcardModalReturn {
  modalState: ModalState;
  openCreate: () => void;
  openEdit: (flashcard: FlashcardViewModel) => void;
  close: () => void;
  save: (data: FlashcardUpdateDto) => Promise<void>;
}
```

#### `useFlashcardActions`

```typescript
interface UseFlashcardActionsReturn {
  deleteState: DeleteDialogState;
  openDelete: (flashcard: FlashcardViewModel) => void;
  confirmDelete: () => Promise<void>;
  cancelDelete: () => void;
}
```

## 7. API Integration

### GET /flashcards

- **Request**: Query parameters for pagination, sorting, and filtering
- **Response**: PaginatedFlashcardsResponseDTO
- **Error Handling**: Display error message, retry option

### PUT /flashcards/{id}

- **Request**: FlashcardUpdateDto
- **Response**: FlashcardDTO
- **Error Handling**: Show validation errors, maintain form state

### DELETE /flashcards/{id}

- **Request**: None
- **Response**: DeleteFlashcardResponseDto
- **Error Handling**: Show error message, retry option

## 8. User Interactions

1. Viewing Flashcards:
   - Navigate pages using pagination controls
   - Sort by clicking column headers
   - Filter by source using dropdown

2. Creating Flashcards:
   - Click "Create Flashcard" button
   - Fill form in modal
   - Save or cancel

3. Editing Flashcards:
   - Click edit button on row
   - Modify fields in modal
   - Save or cancel

4. Deleting Flashcards:
   - Click delete button on row
   - Confirm in dialog
   - Process deletion

## 9. Conditions and Validation

1. Form Validation:
   - Front: Required, ≤200 characters
   - Back: Required, ≤500 characters
   - Source: Valid enum value

2. API Parameters:
   - Page: Positive integer
   - Limit: 10-30 items
   - Sort: Valid column name
   - Order: 'asc' or 'desc'

3. Authentication:
   - Valid session required
   - Redirect to login if unauthorized

## 10. Error Handling

1. API Errors:
   - 401: Redirect to login
   - 400: Show validation errors
   - 404: Show "not found" message
   - 500: Show error message with retry option

2. Validation Errors:
   - Display inline form validation messages
   - Prevent form submission with invalid data

3. Network Errors:
   - Show connection error message
   - Provide retry option
   - Maintain form state

## 11. Implementation Steps

1. Create base Astro page:
   - Add `/flashcards` route
   - Implement authentication check
   - Add React component container

2. Implement custom hooks:
   - Create useFlashcards
   - Create useFlashcardModal
   - Create useFlashcardActions

3. Create base components:
   - Implement FlashcardsView
   - Add FilterBar with source filter
   - Add CreateButton

4. Implement FlashcardsTable:
   - Create table structure
   - Add pagination controls
   - Implement sorting
   - Add action buttons

5. Create FlashcardModal:
   - Implement form with validation
   - Add save/cancel actions
   - Handle create/edit modes

6. Add DeleteConfirmationDialog:
   - Create confirmation UI
   - Implement delete action
   - Add error handling

7. Connect API integration:
   - Implement GET /flashcards with pagination
   - Add PUT /flashcards/{id} for updates
   - Implement DELETE /flashcards/{id}

8. Add error handling:
   - Implement error boundaries
   - Add error messages
   - Handle network errors

9. Enhance UX:
   - Add loading states
   - Add success notifications

10. Add "My Flashcards" and "Generate" navigation buttons in the `Header` component
