// @ts-nocheck — Vitest setup; typechecked by the test runner, not the app build.
import "@testing-library/jest-dom/vitest";
import { expect } from "vitest";
import { toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

// jsdom polyfills used by Radix primitives.
if (!window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

// ResizeObserver / IntersectionObserver stubs
class RO { observe() {} unobserve() {} disconnect() {} }
class IO { observe() {} unobserve() {} disconnect() {} takeRecords() { return []; } }
(globalThis as any).ResizeObserver ??= RO;
(globalThis as any).IntersectionObserver ??= IO;
