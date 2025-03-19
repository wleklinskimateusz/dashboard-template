import { AuthService } from "@/auth/auth-service";

export default function LoginPage() {
  return (
    <form
      action={async (formData) => {
        "use server";

        const authService = new AuthService();
        const username = formData.get("username");
        const password = formData.get("password");

        await authService.login(username as string, password as string);
      }}
    >
      <input type="text" name="username" id="username" />
      <input type="password" name="password" id="password" />
      <button type="submit">Login</button>
    </form>
  );
}
