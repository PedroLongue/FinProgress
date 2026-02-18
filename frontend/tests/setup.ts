import "@testing-library/jest-dom";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

vi.mock("@/hooks/useMobile", () => ({
  useIsMobile: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});
