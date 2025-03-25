import { AuthService } from "@/auth/auth-service";

export async function GET() {
  const authService = new AuthService();
  await authService.logout();
}
