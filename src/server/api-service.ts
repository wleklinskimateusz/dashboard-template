import { ZodSchema } from "zod";

interface FetchOptions<T extends object> extends RequestInit {
  schema?: ZodSchema<T>;
}

export class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.API_URL || "https://dummyjson.com";
  }

  private async tryFetch(path: string, init?: RequestInit) {
    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        ...init,
        headers: {
          ...init?.headers,
          "Content-Type": "application/json",
        },
        body: init?.body,
        method: init?.method || "GET",
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new UnauthorizedError(await response.text());
        } else if (response.status === 404) {
          throw new NotFoundError(await response.text());
        } else if (response.status < 500) {
          throw new BadRequestError(await response.text());
        }
        throw new InternalServerError(await response.text());
      }
      return response.json() as unknown;
    } catch (error) {
      console.error("ApiService Error fetching data:", error);
      throw error;
    }
  }

  async get<T extends object>(path: string, init?: FetchOptions<T>) {
    const data = await this.tryFetch(path, init);
    if (init?.schema) {
      return init.schema.parse(data);
    }
    return data as T;
  }

  async post<T extends object>(
    path: string,
    body: object,
    init?: FetchOptions<T>
  ) {
    const data = await this.tryFetch(path, {
      ...init,
      method: "POST",
      body: JSON.stringify(body),
    });

    if (init?.schema) {
      return init.schema.parse(data);
    }
    return data as T;
  }

  async put<T extends object>(
    path: string,
    body: unknown,
    init?: FetchOptions<T>
  ) {
    const data = await this.tryFetch(path, {
      ...init,
      method: "PUT",
      body: JSON.stringify(body),
    });

    if (init?.schema) {
      return init.schema.parse(data);
    }
    return data as T;
  }

  async delete<T extends object>(path: string, init?: FetchOptions<T>) {
    const data = await this.tryFetch(path, {
      ...init,
      method: "DELETE",
    });

    if (init?.schema) {
      return init.schema.parse(data);
    }
    return data as T;
  }
}

export class UnauthorizedError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class NotFoundError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class BadRequestError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "BadRequestError";
  }
}

export class InternalServerError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "InternalServerError";
  }
}
