/* eslint-disable @typescript-eslint/ban-ts-comment */
import "@testing-library/jest-dom";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// @ts-expect-error
global.ResizeObserver = ResizeObserverMock;

vi.mock("@/hooks/useMobile", () => ({
  useIsMobile: vi.fn(),
}));

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});
