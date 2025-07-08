import { createLoginAction, LoginPage } from "./login-page";
import { render, screen } from "@testing-library/react";
import * as serverActions from "../server/login";
import { BadRequestError } from "@/server/api-service";
import { loginAction } from "../server/login";

describe("LoginPage", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render", () => {
    render(<LoginPage />);
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  describe("createLoginAction", () => {
    const mockAlert = vi.fn();
    vi.stubGlobal("alert", mockAlert);

    const mockServerAction = vi.spyOn(serverActions, "loginAction");

    it("should call the server action with the form data", async () => {
      mockServerAction.mockResolvedValue(undefined);
      const formData = new FormData();
      formData.set("username", "test");
      formData.set("password", "test");
      await loginAction(formData);
      expect(mockServerAction).toHaveBeenCalledWith(formData);
    });

    it("should alert an error message if the login fails with a BadRequestError", async () => {
      mockServerAction.mockRejectedValue(
        new BadRequestError("Something went wrong")
      );
      const loginAction = createLoginAction();

      await loginAction(new FormData());

      expect(mockAlert).toHaveBeenCalledWith("Something went wrong");
    });

    it("should throw an error if the login fails with an unknown error", async () => {
      mockServerAction.mockRejectedValue(new Error("Something went wrong"));
      const loginAction = createLoginAction();

      await expect(loginAction(new FormData())).rejects.toThrow(
        "Something went wrong"
      );
      expect(mockAlert).not.toHaveBeenCalled();
    });
  });
});
