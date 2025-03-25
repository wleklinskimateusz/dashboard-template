"use server";

import { AuthService } from "../auth-service";

export const loginAction = async (formData: FormData) => {
  const authService = new AuthService();
  const username = formData.get("username");
  const password = formData.get("password");

  await authService.login(username as string, password as string);
};
