"use client";

import { Button } from "@/components/ui/button";
import { loginAction } from "../server/login";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const createLoginAction = () => async (formData: FormData) => {
  try {
    await loginAction(formData);
  } catch (error) {
    if (error instanceof Error && error.name === "BadRequestError") {
      alert(error.message);
    } else {
      throw error;
    }
  }
};

export const LoginPage = () => {
  return (
    <form
      className="flex flex-col gap-4 w-full max-w-md"
      aria-label="Login form"
      action={createLoginAction()}
    >
      <Label htmlFor="username">Username</Label>
      <Input type="text" name="username" id="username" />
      <Label htmlFor="password">Password</Label>
      <Input type="password" name="password" id="password" />
      <Button type="submit">Login</Button>
    </form>
  );
};
