import { AuthService, NoTokenFound } from "./auth-service";
import { cookies } from "next/headers";
import {
  RequestCookies,
  ResponseCookies,
} from "next/dist/compiled/@edge-runtime/cookies";
import { redirect } from "next/navigation";
import { UnauthorizedError } from "@/server/api-service";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

describe("AuthService", () => {
  const mockGetCookies = vi.fn();
  const mockSetCookies = vi.fn();
  const mockDeleteCookies = vi.fn();
  const mockFetch = vi.fn();

  global.fetch = mockFetch;

  vi.mocked(cookies).mockResolvedValue({
    set: mockSetCookies,
    get: mockGetCookies,
    delete: mockDeleteCookies,
  } as unknown as Omit<RequestCookies, "set" | "clear" | "delete"> & Pick<ResponseCookies, "set" | "delete">);

  const mockRedirect = vi.fn();

  vi.mocked(redirect).mockImplementation(
    mockRedirect as unknown as typeof redirect
  );

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize AuthService", () => {
    const authService = new AuthService();
    expect(authService.apiService).toBeDefined();
  });

  describe("login", () => {
    it("should login successfully", async () => {
      const authService = new AuthService();

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ accessToken: "test" }),
      });

      await authService.login("test", "test");
      expect(mockSetCookies).toHaveBeenCalledWith("token", "test");
      expect(mockRedirect).toHaveBeenCalledWith("/");
    });

    it("should handle incorrect credentials", async () => {
      const authService = new AuthService();

      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
        text: () => Promise.resolve("Invalid credentials"),
      });

      await expect(authService.login("test", "test")).rejects.toThrow(
        "Invalid credentials"
      );

      expect(mockRedirect).not.toHaveBeenCalled();
    });

    it("should handle server errors", async () => {
      const authService = new AuthService();

      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        text: () => Promise.resolve("Internal server error"),
      });

      await expect(authService.login("test", "test")).rejects.toThrow(
        "Internal server error"
      );

      expect(mockRedirect).not.toHaveBeenCalled();
    });
  });

  describe("logout", () => {
    it("should logout successfully", async () => {
      const authService = new AuthService();

      await authService.logout();
      expect(mockDeleteCookies).toHaveBeenCalledWith("token");
      expect(mockRedirect).toHaveBeenCalledWith("/login");
    });
  });

  describe("getUser", () => {
    it("should get user successfully", async () => {
      const authService = new AuthService();

      mockGetCookies.mockReturnValue({
        value: "test",
      });

      mockFetch.mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 1,
            username: "test",
            email: "test@test.com",
            firstName: "Test",
            lastName: "User",
            gender: "male",
            image: "test.com/image.png",
          }),
      });

      await authService.getUser();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: {
            Authorization: "Bearer test",
            "Content-Type": "application/json",
          },
        })
      );
    });

    it("should handle missing token", async () => {
      const authService = new AuthService();

      mockGetCookies.mockReturnValue(null);

      await expect(authService.getUser()).rejects.toThrow(NoTokenFound);
    });

    it("should handle unauthorized error", async () => {
      const authService = new AuthService();

      mockGetCookies.mockReturnValue({
        value: "test",
      });

      mockFetch.mockRejectedValue(new UnauthorizedError());

      await expect(authService.getUser()).rejects.toThrow(UnauthorizedError);
      expect(mockRedirect).toHaveBeenCalledWith("/logout");
    });
  });
});
