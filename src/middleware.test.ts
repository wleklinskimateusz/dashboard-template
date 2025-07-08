import { middleware } from "./middleware";
import { NextRequest } from "next/server";

describe("middleware", () => {
  it("should redirect to login if no token", () => {
    const request = new NextRequest("http://localhost:3000/");
    const response = middleware(request);
    expect(response.status).toBe(307);
    expect(response.headers.get("Location")).toBe(
      "http://localhost:3000/login"
    );
  });

  it("should allow the request to continue if there is a token", () => {
    const request = new NextRequest("http://localhost:3000/");
    request.cookies.set("token", "123");
    const response = middleware(request);
    expect(response.status).toBe(200);
  });
});
