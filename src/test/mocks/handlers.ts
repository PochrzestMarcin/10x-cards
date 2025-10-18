import { http, HttpResponse } from "msw";

// Define your mock handlers here
export const handlers = [
  // Example handler for the login endpoint
  http.post("/api/auth/login", () => {
    return HttpResponse.json({
      user: {
        id: "1",
        email: "test@example.com",
      },
      session: {
        access_token: "mock-token",
      },
    });
  }),
];
