import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import App from "./App";
import { renderWithProviders } from "./test-utils";

// Modul layout tidak pernah selesai dimuat, sehingga fallback Suspense tetap tampil.
vi.mock("./features/lost-founds/layouts/LostFoundLayout", () => new Promise(() => {}));

describe("App suspense fallback", () => {
  it("should show loading fallback while lazy route is loading", () => {
    renderWithProviders(<App />, { route: "/" });

    expect(screen.getByText("Memuat data...")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
  });
});
