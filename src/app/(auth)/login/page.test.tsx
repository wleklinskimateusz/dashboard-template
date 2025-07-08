import { describe, expect, it } from "vitest";
import LoginPage from "./page";
import { render, screen } from "@testing-library/react";

describe("LoginPage", () => {
  it("should render", () => {
    render(<LoginPage />);
    expect(screen.getByText(/Login/)).toBeInTheDocument();
  });
});
