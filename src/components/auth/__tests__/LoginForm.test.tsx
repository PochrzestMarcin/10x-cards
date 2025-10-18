import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LoginForm } from "../LoginForm";
import { render } from "../../../test/test-utils";

// Mock Sonner toast
vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
  Toaster: () => null,
}));

// Mock window.location
Object.defineProperty(window, "location", {
  value: {
    href: "",
  },
  writable: true,
});

// Mock the auth store
vi.mock("../../../lib/stores/auth.store", () => ({
  useAuthStore: vi.fn().mockImplementation((selector) => {
    const state = {
      user: null,
      setUser: vi.fn(),
    };
    return selector(state);
  }),
}));

// Mock fetch
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

beforeEach(() => {
  mockFetch.mockReset();
  vi.clearAllMocks();
  // Mock successful response by default
  mockFetch.mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ user: { id: "1", email: "test@example.com" } }),
  });
  // Reset window.location.href
  window.location.href = "";
});

describe("LoginForm", () => {
  it("renders login form correctly", () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });
});
