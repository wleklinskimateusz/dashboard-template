import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";
import { UnauthorizedError } from "@/server/api-service";
import * as navigation from "next/navigation";

const mockGetProducts = vi.fn().mockResolvedValue({
  products: [],
});

vi.mock("@/auth/auth-service", () => ({
  AuthService: vi.fn().mockImplementation(() => ({
    getUser: vi.fn().mockResolvedValue({
      username: "test",
    }),
  })),
}));

vi.mock("@/server/api-service", () => ({
  UnauthorizedError: vi.fn(),
  ApiService: vi.fn().mockImplementation(() => ({
    get: mockGetProducts,
  })),
}));

const mockRedirect = vi.fn();

vi.mock("next/navigation", () => ({
  redirect: vi.fn().mockImplementation((...args) => mockRedirect(...args)),
}));

describe("Home", () => {
  it("should render", async () => {
    render(await Home());
    expect(screen.getByText(/Welcome/)).toBeInTheDocument();
  });

  it("should render products", async () => {
    mockGetProducts.mockResolvedValue({
      products: [
        { id: 1, title: "Product 1", price: 100 },
        { id: 2, title: "Product 2", price: 200 },
      ],
    });
    render(await Home());
    expect(screen.getByText(/Welcome/)).toBeInTheDocument();
    expect(screen.getByText(/Product 1/)).toBeInTheDocument();
    expect(screen.getByText(/Product 2/)).toBeInTheDocument();
  });

  it("should redirect to login if the user is not authenticated", async () => {
    mockGetProducts.mockRejectedValue(new UnauthorizedError());
    vi.spyOn(navigation, "redirect");
    render(await Home());
    expect(mockRedirect).toHaveBeenCalledWith("/login");
  });

  it("should print an error message if the error is not an UnauthorizedError", async () => {
    mockGetProducts.mockRejectedValue(new Error("Something went wrong"));
    render(await Home());
    expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
  });
});
