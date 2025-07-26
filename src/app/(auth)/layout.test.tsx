import { describe, it } from "vitest";
import { render, screen } from "@testing-library/react";
import AuthLayout from "./layout";

describe("AuthLayout", () => {
  it("should render", () => {
    render(<AuthLayout>Test</AuthLayout>);

    expect(screen.getByText("Test")).toBeInTheDocument();
  });
});
