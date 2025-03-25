"use client";

import { loginAction } from "../server/login";

export const LoginPage = () => {
  return (
    <form
      action={async (formData) => {
        try {
          await loginAction(formData);
        } catch (error) {
          if (error instanceof Error && error.name === "BadRequestError") {
            alert(error.message);
          } else {
            throw error;
          }
        }
      }}
    >
      <input type="text" name="username" id="username" />
      <input type="password" name="password" id="password" />
      <button type="submit">Login</button>
    </form>
  );
};
