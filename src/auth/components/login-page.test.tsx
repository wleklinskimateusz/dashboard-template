import { LoginPage } from "./login-page";
import { render, screen } from "@testing-library/react";
import { BadRequestError } from "@/server/api-service";
describe("LoginPage", () => {
  const mockAlert = vi.fn();
  vi.stubGlobal("alert", mockAlert);

  it("should render", () => {
    render(<LoginPage />);
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("should show an error message if the login fails", () => {
    const mockLoginAction = vi.fn();

    mockLoginAction.mockRejectedValue(
      new BadRequestError("Something went wrong")
    );
    render(<LoginPage />);
    expect(mockAlert).toHaveBeenCalledWith("Something went wrong");
  });
});
