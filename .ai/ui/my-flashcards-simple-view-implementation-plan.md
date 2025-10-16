# View Implementation Plan: My Flashcards

## 1. Overview
The My Flashcards view allows users to manage their saved flashcards through a paginated table interface. Users can view, edit, and delete existing flashcards, as well as create new ones manually. The view supports filtering by source and includes a modal for editing/creating flashcards.

## 2. View Routing
The view should be accessible under the path `/flashcards` and requires authentication.

## 3. Component Structure
**FlashcardsPage** (Astro)
└── **FlashcardsView** (React)
    ├── **FlashcardsTable**
       └── FlashcardRow

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

### `FlashcardsTable`
- **Description**: Displays flashcards in a paginated table format. 
- **Elements**: 
  - Table with Columns: `Front`, `Back`, `Source` (sortable), `Updated At` (sortable)
  - Pagination controls
- **Handled Events**: 
  - Column header clicks (sorting)
  - Page navigation
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
  sortOrder: 'asc' | 'desc';
  sourceFilter: FlashcardSource | null;
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

## 7. API Integration

### GET /flashcards
- **Request**: Query parameters for pagination, sorting, and filtering
- **Response**: PaginatedFlashcardsResponseDTO
- **Error Handling**: Display error message, retry option

## 8. User Interactions

1. Viewing Flashcards:
   - Navigate pages using pagination controls
   - Sort by clicking column headers
   - Filter by source using dropdown

## 9. Conditions and Validation

1. API Parameters:
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

2. Network Errors:
   - Show connection error message
   - Provide retry option
   - Maintain form state

## 11. Implementation Steps

1. Implement custom hook:
   - Create useFlashcards

2. Create base components:
   - Implement FlashcardsView
   - Add FilterBar with source filter

3. Implement FlashcardsTable:
   - Create table structure
   - Add pagination controls
   - Implement sorting

4. Connect API integration:
   - Implement GET /flashcards with pagination

5. Add FlashcardsView to flashcards.astro page

6. Add error handling:
   - Implement error boundaries
   - Add error messages
   - Handle network errors
