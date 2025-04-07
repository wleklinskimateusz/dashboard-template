import { AuthService } from "@/auth/auth-service";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const authService = new AuthService();
  await authService.logout();

  return NextResponse.redirect(new URL("/login", request.url));
}
