import { describe, expect, it, vi } from "vitest";
import {
  ApiService,
  BadRequestError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "./api-service";
import { z } from "zod";

describe("ApiService", () => {
  const mockFetch = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
  });

  global.fetch = mockFetch;

  function mockFetchResponse(status: number, body: object) {
    mockFetch.mockResolvedValueOnce({
      ok: status < 300,
      status,
      json: () => Promise.resolve(body),
      text: () => Promise.resolve(JSON.stringify(body)),
    });
  }

  describe("get", () => {
    it("should be able to get a response", async () => {
      mockFetchResponse(200, {
        id: 1,
        name: "John Doe",
      });
      const apiService = new ApiService();
      const user = await apiService.get("/users/1");
      expect(user).toEqual({
        id: 1,
        name: "John Doe",
      });
    });

    it("should be able to get a response with a schema", async () => {
      mockFetchResponse(200, {
        id: 1,
        name: "John Doe",
      });
      const apiService = new ApiService();

      const user = await apiService.get("/users/1", {
        schema: z.object({
          id: z.number(),
          name: z.string(),
        }),
      });

      expect(user).toEqual({
        id: 1,
        name: "John Doe",
      });
    });

    it("should handle 401 error", async () => {
      mockFetchResponse(401, {
        message: "Unauthorized",
      });
      const apiService = new ApiService();
      await expect(apiService.get("/users/1")).rejects.toThrow(
        UnauthorizedError
      );
    });

    it("should handle 404 error", async () => {
      mockFetchResponse(404, {
        message: "Not Found",
      });
      const apiService = new ApiService();
      await expect(apiService.get("/users/1")).rejects.toThrow(NotFoundError);
    });

    it("should handle 400 error", async () => {
      mockFetchResponse(400, {
        message: "Bad Request",
      });
      const apiService = new ApiService();
      await expect(apiService.get("/users/1")).rejects.toThrow(BadRequestError);
    });

    it("should handle 500 error", async () => {
      mockFetchResponse(500, {
        message: "Internal Server Error",
      });
      const apiService = new ApiService();
      await expect(apiService.get("/users/1")).rejects.toThrow(
        InternalServerError
      );
    });
  });

  describe("post", () => {
    it("should be able to post a response", async () => {
      mockFetchResponse(200, {
        message: "Created",
      });
      const apiService = new ApiService();
      const user = await apiService.post("/users", {
        name: "John Doe",
      });
      expect(user).toEqual({
        message: "Created",
      });
    });

    it("should be able to post a response with a schema", async () => {
      mockFetchResponse(200, {
        message: "Created",
      });
      const apiService = new ApiService();

      const user = await apiService.post(
        "/users",
        {
          name: "John Doe",
        },
        {
          schema: z.object({
            message: z.string(),
          }),
        }
      );

      expect(user).toEqual({
        message: "Created",
      });
    });
  });

  describe("put", () => {
    it("should be able to put a response", async () => {
      mockFetchResponse(200, {
        message: "Updated",
      });
      const apiService = new ApiService();
      const user = await apiService.put("/users/1", {
        name: "John Doe",
      });
      expect(user).toEqual({
        message: "Updated",
      });
    });

    it("should be able to put a response with a schema", async () => {
      mockFetchResponse(200, {
        message: "Updated",
      });
      const apiService = new ApiService();

      const user = await apiService.put(
        "/users/1",
        {
          name: "John Doe",
        },
        {
          schema: z.object({
            message: z.string(),
          }),
        }
      );

      expect(user).toEqual({
        message: "Updated",
      });
    });
  });

  describe("delete", () => {
    it("should be able to delete a response", async () => {
      mockFetchResponse(200, {
        message: "Deleted",
      });
      const apiService = new ApiService();
      const user = await apiService.delete("/users/1");
      expect(user).toEqual({
        message: "Deleted",
      });
    });

    it("should be able to delete a response with a schema", async () => {
      mockFetchResponse(200, {
        message: "Deleted",
      });
      const apiService = new ApiService();

      const user = await apiService.delete("/users/1", {
        schema: z.object({
          message: z.string(),
        }),
      });

      expect(user).toEqual({
        message: "Deleted",
      });
    });
  });
});
