import { describe, it, expect, vi } from "vitest";
import { GET } from "./route";

const mockAuthService = {
  logout: vi.fn(),
};

vi.mock("@/auth/auth-service", () => ({
  AuthService: vi.fn().mockImplementation(() => mockAuthService),
}));

describe("GET /logout", () => {
  it("should logout the user", async () => {
    const request = new Request("http://localhost:3000/logout");
    const response = await GET(request);
    expect(response.status).toBe(307);
    expect(response.headers.get("Location")).toBe(
      "http://localhost:3000/login"
    );
  });
});
