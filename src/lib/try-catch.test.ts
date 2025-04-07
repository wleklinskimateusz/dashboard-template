import { tryCatch, tryCatchAsync } from "./try-catch";

describe("tryCatch", () => {
  it("should be able to catch an error", () => {
    const result = tryCatch(() => {
      throw new Error("test");
    });
    expect(result).toEqual({ result: undefined, error: new Error("test") });
  });

  it("should be able to catch an error", () => {
    const result = tryCatch(() => {
      return "test";
    });
    expect(result).toEqual({ result: "test", error: undefined });
  });
});

describe("tryCatchAsync", () => {
  it("should be able to catch an error", async () => {
    const result = await tryCatchAsync(async () => {
      throw new Error("test");
    });
    expect(result).toEqual({ result: undefined, error: new Error("test") });
  });

  it("should be able to catch an error", async () => {
    const result = await tryCatchAsync(async () => {
      return "test";
    });
    expect(result).toEqual({ result: "test", error: undefined });
  });
});
