import { loginAction } from "./login";

const mockAuthService = {
  login: vi.fn(),
};

vi.mock("../auth-service", () => ({
  AuthService: vi.fn().mockImplementation(() => mockAuthService),
}));

describe("loginAction", () => {
  it("should be able to login", async () => {
    const formData = new FormData();
    formData.append("username", "test_user");
    formData.append("password", "test_password");
    await loginAction(formData);
    expect(mockAuthService.login).toHaveBeenCalledWith(
      "test_user",
      "test_password"
    );
  });
});
