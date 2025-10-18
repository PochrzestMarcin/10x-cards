# 10x-cards

A web application for creating and managing educational flashcards with the help of AI.

## Table of Contents

- [Project Description](#project-description)
- [Tech Stack](#tech-stack)
- [Getting Started Locally](#getting-started-locally)
- [Available Scripts](#available-scripts)
- [Project Scope](#project-scope)
- [Project Status](#project-status)
- [License](#license)

## Project Description

**10x-cards** is a web application designed to help users quickly create and manage sets of educational flashcards. The core feature of the application is the use of Large Language Models (LLMs) via an API to automatically generate flashcard suggestions from user-provided text. This addresses the common problem of manual flashcard creation being a time-consuming and tedious process, which often discourages learners from using effective study methods like spaced repetition.

The application aims to significantly reduce the time required to create high-quality learning materials, making studying more efficient and accessible.

## Tech Stack

The project utilizes a modern tech stack to deliver a fast, interactive, and scalable user experience.

### Frontend

- **[Astro 5](https://astro.build/)**: For building fast, content-focused websites with a minimal JavaScript footprint.
- **[React 19](https://react.dev/)**: For creating interactive and dynamic user interface components.
- **[TypeScript 5](https://www.typescriptlang.org/)**: For static typing, ensuring code quality and maintainability.
- **[Tailwind CSS 4](https://tailwindcss.com/)**: A utility-first CSS framework for rapid UI development.
- **[Shadcn/ui](https://ui.shadcn.com/)**: A collection of re-usable UI components.

### Backend & Database

- **[Supabase](https://supabase.io/)**: An open-source Firebase alternative providing a PostgreSQL database, authentication, and a Backend-as-a-Service SDK.

### AI Integration

- **[OpenRouter.ai](https://openrouter.ai/)**: A service that provides access to a wide range of LLMs (from OpenAI, Anthropic, Google, etc.) for generating flashcards.

### Testing

- **[Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/react)**: For unit and integration testing of React components and services
- **[Playwright](https://playwright.dev/)**: For end-to-end testing across multiple browsers
- **[Lighthouse](https://developers.google.com/web/tools/lighthouse)**: For performance testing and monitoring

### DevOps

- **[GitHub Actions](https://github.com/features/actions)**: For continuous integration and deployment pipelines.
- **[DigitalOcean](https://www.digitalocean.com/)**: For hosting the application via Docker containers.

## Getting Started Locally

To set up and run the project on your local machine, follow these steps.

### Prerequisites

- **Node.js**: Version `22.14.0` is required. We recommend using a version manager like [nvm](https://github.com/nvm-sh/nvm).
  ```sh
  nvm use
  ```
- **npm**: Should be installed with Node.js.

### Installation

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/PochrzestMarcin/10x-cards.git
    cd 10x-cards
    ```

2.  **Install dependencies:**

    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project by copying the example file:

    ```sh
    cp .env.example .env
    ```

    You will need to populate this file with your credentials for Supabase and OpenRouter.

    ```env
    # Supabase credentials
    PUBLIC_SUPABASE_URL="your-supabase-url"
    PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"

    # OpenRouter API Key
    OPENROUTER_API_KEY="your-openrouter-api-key"
    ```

### Running the Application

Once the installation is complete, you can start the development server:

```sh
npm run dev
```

The application will be available at `http://localhost:4321`.

## Available Scripts

The `package.json` file includes the following scripts for managing the project:

- `npm run dev`: Starts the Astro development server with hot-reloading.
- `npm run build`: Builds the application for production.
- `npm run preview`: Starts a local server to preview the production build.
- `npm run astro`: Provides access to the Astro CLI.
- `npm run lint`: Lints the codebase using ESLint to find and report issues.
- `npm run lint:fix`: Lints the codebase and automatically fixes fixable issues.
- `npm run format`: Formats the code using Prettier.

## Project Scope

### Key Features (In Scope for MVP)

- **AI-Powered Flashcard Generation**: Users can paste text (1,000-10,000 characters) to get AI-generated flashcard suggestions.
- **Manual Flashcard Management**: Full CRUD (Create, Read, Update, Delete) functionality for flashcards.
- **User Authentication**: Secure registration, login, and account management.
- **Spaced Repetition System**: Integration with an open-source algorithm for effective learning sessions.
- **Data Privacy**: GDPR-compliant handling of user data with options for data access and deletion.
- **Usage Statistics**: Tracking the number of AI-generated vs. user-accepted flashcards.

### Out of Scope (for MVP)

- Advanced, custom-built spaced repetition algorithm.
- Gamification features.
- Native mobile applications (the initial focus is on the web).
- Importing documents in formats like PDF or DOCX.
- A public API for third-party integrations.
- Features for sharing flashcards between users.
- Advanced notification system.

## Project Status

**Active Development**: This project is currently in the initial development phase.

## License

This project does not currently have a license. Please check back later for updates.
