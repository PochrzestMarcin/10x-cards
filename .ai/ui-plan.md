# UI Architecture for 10x-cards

## 1. UI Structure Overview

The user interface is built around the flashcard generation view available after authorisation. The structure includes authentication views, flashcard generation, a list of flashcards with an edit modal, a panel, and a revision session view. The whole thing uses responsive design based on Tailwind, ready-made components from Shadcn/ui, and React.

## 2. View List

### 2.1 Auth – Login

- **Path**: `/login` and `/register`
- **Purpose**: Allow users to login and register.
- **Key Information**: Email, password fields; Messages about authentication errors
- **Key Components**: Login/registration form. Validation component, buttons, error messages.
- **UX/Accessibility/Security**: Simple form, clear error messages, keyboard support, jwt security

### 2.2 Flashcard Generation

- **Path**: `/generate`
- **Purpose**: Enables the user to generate flashcard suggestions by AI and review them (accept, edit, or reject).
- **Key Information**: Text input field with life characted counter (1000 - 10000 characters), list of AI-generated card suggestions, accept, edit, or reject buttons for each card.
- **Key Components**: Text input component, ‘Generate flashcards’ button, flashcard list, action buttons (save all, save accepted), loading indicator (skeleton), error messages
- **UX/Accessibility/Security**: Intuitive form, text length validation (1000-10000 characters), responsiveness, clear messages and inline error messages

### 2.3 My Flashcards

- **Path**: `/flashcards`
- **Purpose**: Review, edit, and delete saved flashcards.
- **Key Information**: List of saved flashcards with question and answer information
- **Key Components**: List of items, edit modal component, delete buttons, operation confirmation
- **UX/Accessibility/Security**: Clear list layout, keyboard accessibility for modification, deletion confirmation

### 2.4 Modal - Edition of Flashcards

- **Path**: Shown above list of flashcards view.
- **Purpose**: Enable editing of data validation cards without real-time saving
- **Key Information**: Flashcard edit form, fields `front` and `back`, validation messages.
- **Key Components**: Modal with form, buttons `Save` and `Cancel`
- **UX/Accessibility/Security**: Intuitive modal, data validation on client side before sending request with changes

### 2.5 User Panel

- **Path**: `/profle`
- **Purpose**: Account data management.
- **Key Information**: User data, options to edit the profile, logout button.
- **Key Components**: Edit profile form, action button.
- **UX/Accessibility/Security**: Safe logout, easy access to settings, straighforward and readable interface.

### 2.6 Learning Session

- **Path**: `/session`
- **Purpose**: Allow conducting learning session with flashcards according to learning algorithm.
- **Key Information**: Showing flashcard `front`, button to show the `back` of the flashcard. Assessment mechanism
- **Key Components**: Flashcard display component, interaction button (e.g. ‘Show answer’, ‘Rating’), session counter
- **UX/Accessibility/Security**: Minimalist interface focused on learning, responsiveness, clear high-contrast buttons, intuitive system for moving between flashcards

## 3. User Journey Map

1. The user accesses the application and is taken to the login/registration screen.
2. After successful authentication, the user is redirected to the flashcard generation view.
3. The user enters text for flashcard generation and initiates the generation process.
4. The API returns flashcard suggestions, which are presented in the generation view.
5. The user reviews the suggestions and decides which flashcards to accept, edit, or reject (optional opening of the edit modal).
6. The user approves the selected flashcards and performs a bulk save by interacting with the API.
7. The user then goes to the ‘My Flashcards’ view, where they can view, edit, or delete flashcards.
8. The user uses navigation to visit the user panel and optionally start a revision session.
9. In case of errors (e.g. validation, API issues), the user receives inline messages.

## 4. Navigation layout and structure

- **Main navigation:** Available as a top menu in the page layout after logging in.
- **Navigation elements:** Links to views: `Generate flashcards`, `My flashcards`, `Study session`, `Profile` and the logout button.
- **Responsiveness:** In the mobile view, the navigation transforms into a hamburger menu, allowing easy access to other views.
- **Flow:** Navigation allows for seamless transition between views, preserving the user's context and session data.

## 5. Key components

- **Authentication forms:** Login and registration components with validation support.
- **Card generation component:** With a text field and a button to start the generation process, with a loading indicator.
- **Card list:** An interactive component displaying a list of cards with edit and delete options.
- **Editing modal:** Component enabling flashcard editing with data validation before confirmation.
- **Toast notifications:** Component for displaying success and error messages.
- **Sidebar/Navigation:** Navigation elements facilitating movement between views.
- **Revision session component:** Interactive layout for displaying flashcards during a learning session with an assessment mechanism.
