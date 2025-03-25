import { ApiService, UnauthorizedError } from "@/server/api-service";
import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export class AuthService {
  apiService: ApiService;
  constructor() {
    this.apiService = new ApiService();
  }

  private async saveToken(token: string) {
    const cookieHandle = await cookies();
    cookieHandle.set("token", token);
  }

  async login(username: string, password: string) {
    const response = await this.apiService.post(
      "/auth/login",
      {
        username,
        password,
        expiresInMins: 15,
      },
      {
        schema: z.object({
          accessToken: z.string(),
        }),
        cache: "no-store",
      }
    );

    await this.saveToken(response.accessToken);
    redirect("/");
  }

  async logout() {
    const cookieHandle = await cookies();
    cookieHandle.delete("token");
    redirect("/login");
  }

  async getUser() {
    const cookieHandle = await cookies();
    const token = cookieHandle.get("token")!.value;

    try {
      const user = await this.apiService.get("/auth/me", {
        schema: z.object({
          id: z.number(),
          username: z.string(),
          email: z.string(),
          firstName: z.string(),
          lastName: z.string(),
          gender: z.string(),
          image: z.string(),
        }),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return user;
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        redirect("/logout");
      }
      throw error;
    }
  }
}
