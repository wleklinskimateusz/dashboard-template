import { expect, it } from "vitest";

import { describe } from "vitest";
import { cn } from "./utils";

describe("utils", () => {
  it("should be able to merge classes", () => {
    const result = cn("bg-red-500", "text-white");
    expect(result).toBe("bg-red-500 text-white");
  });
});
