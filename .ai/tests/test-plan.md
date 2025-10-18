[1 tool called]

# Plan testów projektu „10x-cards”

## 1. Introduction and testing objectives

The objective of the plan is to ensure the high quality of the ‘10x-cards’ application by defining a comprehensive testing strategy. The tests are designed to:

- detect functional and non-functional defects prior to deployment,
- confirm that business and technical requirements are met,
- reduce the risk of regression during further development,
- provide reliable quality metrics for stakeholders.

## 2. Scope of testing

The following will be covered by testing:

1. Frontend layer (Astro + React 19 + TypeScript): `.astro` pages, React components, client logic, routing.
2. Backend layer (Supabase): RLS procedures, database functions, CRUD operations on `flashcards` and `generations` tables, authorisation.
3. API `/src/pages/api/**`: `auth`, `flashcards`, and `generations` endpoints.
4. AI services layer (`openrouter.service.ts`, `ai.service.ts`): communication with Openrouter, limits, error handling.
5. End-to-end integration: user scenarios (registration, login, flashcard generation, flashcard management).
6. Performance: API response time, page rendering, Openrouter API usage.
7. Security: authentication, authorisation, RLS, password storage, XSS/CSRF protection.

Out of scope: extensive penetration testing, browser compatibility testing < ES2019.

## 3. Types of tests

| Rodzaj                      | Opis                                                                                    | Narzędzia                                                   |
| --------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Unit tests                  | Function helpers, Zod validators, services (`flashcard.service`, `generation.service`). | Vitest, React Testing Library                               |
| Integration tests           | layers communication (API ↔ Supabase, React ↔ Astro).                                 | Vitest + `@testing-library/react`, Supabase test containers |
| E2E Tests                   | Real scenarios of the user in browser.                                                  | Playwright (headless & headed)                              |
| Performance tests           | Profiling of API responses and pages rendering.                                         | k6, Lighthouse CI                                           |
| Usability tests (heuristic) | UI assessment, accessibility (a11y).                                                    | Axe-core, Lighthouse                                        |
| Security tests (basic)      | OWASP ZAP in CI mode, static analysis ESLint-plugin-security.                           | ZAP, Snyk OSS                                               |

## 4. Test scenarios for key functionalities

1. **User registration**
   - Success with correct e-mail and password
   - Refusal with duplicate e-mail
   - Password field validation (min. 8 characters)
2. **Login**
   - Correct and incorrect login
   - Password reset (e-mail link)
3. **Flashcard generation**
   - Sending a prompt → receiving a list of flashcards
   - Handling error 429/500 from Openrouter
4. **Flashcard management**
   - Adding multiple flashcards (BulkSaveButton)
   - Editing, deleting (confirmation dialogue)
   - Pagination, sorting, filtering
5. **Permissions**
   - Access to cards only for the owner (RLS)
   - No possibility to modify other people's data
6. **UI / responsiveness**
   - Rendering on desktop/tablet/mobile
   - Light/dark mode (ThemeToggle)

## 5. Test environment

- **Local**: Node 20 LTS, Supabase Local (Docker), Openrouter stub. Astro + React
- **Test**: Dedicated test server with supabase config, separate database and docker container for reusability of the environment
- **CI/CD integration**: Automatic tests triggering in pipeline (GitHub Actions) to verify each change in the code.

Test configuration stored in `.env.test`, Openrouter mocks using MSW.

## 6. Testing tools

- ViTest + React Testing Library – unit/integration tests
- Playwright – E2E
- Lighthouse – performance tests
- Postman - manual and automatisation of API tests

## 7. Test schedule

| Phase                                   | Duration       | Tasks                                                      |
| --------------------------------------- | -------------- | ---------------------------------------------------------- |
| Unit & integration tests implementation | W1–W3          | implementation and starting the unit and integration tests |
| E2E Scenarios                           | W3–W5          | Playwright, critical paths                                 |
| Performance & security                  | W5             | Lighthouse                                                 |
| Regression before release               | each iteration | automatic in CI                                            |

## 8. Test acceptance criteria

- Code coverage **≥ 75%** for key services (`lib/services`).
- All tests in CI end with a ‘pass’ status.
- No high and critical level errors in Bug Tracker.
- API performance P95 < 300 ms, Lighthouse Performance ≥ 90.
- Compliance with WCAG 2.1 AA (Axe report without critical issues).

## 9. Roles and responsibilities

| Role                             | Responsibility                                          |
| -------------------------------- | ------------------------------------------------------- |
| QA Engineer (author of the plan) | Maintaining the test plan, reports, defining test cases |
| Developer                        | Writing unit/integration tests, fixing defects          |
| DevOps                           | Configuring test environments, CI pipelines             |
| Product Owner                    | Approving acceptance criteria, prioritising defects     |
| Tech Lead                        | Code and test quality review, technical support         |

## 10. Bug reporting procedure

1. Report in GitHub Issues with the `bug` label.
2. Required fields: title, reproduction steps, expected result, actual result, screenshots/logs, priority.
3. QA verifies duplicates and assigns priority (`P0–P3`).
4. The developer assigned to the task fixes the bug and opens a PR with a regression test.
5. QA retests and marks `Fixed` or `Reopen`.

---

The plan ensures full coverage of key areas of the ‘10x-cards’ project using tailored tools and processes, minimising the risk of defects prior to production deployment.
