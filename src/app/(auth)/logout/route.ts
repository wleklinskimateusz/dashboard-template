import { AuthService } from "@/auth/auth-service";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET() {
  const authService = new AuthService();
  await authService.logout();
  const cookieStore = await cookies();
  cookieStore.delete("token");
  redirect("/login");
}
