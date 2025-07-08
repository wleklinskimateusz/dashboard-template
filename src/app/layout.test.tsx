import { describe, expect, it } from "vitest";
import Layout from "./layout";
import { render, screen } from "@testing-library/react";

vi.mock("./globals.css", () => ({
  default: vi.fn(),
}));

describe("Layout", () => {
  it("should render", () => {
    render(
      <Layout>
        <div>
          <h1>Test</h1>
        </div>
      </Layout>
    );
    expect(screen.getByText(/Test/)).toBeInTheDocument();
  });
});
