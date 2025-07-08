"use client";

import { loginAction } from "../server/login";

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
    <form aria-label="Login form" action={createLoginAction()}>
      <div>
        <label htmlFor="username">Username</label>
        <input type="text" name="username" id="username" />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};
