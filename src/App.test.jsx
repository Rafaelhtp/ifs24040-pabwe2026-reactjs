import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import App from "./App";
import { renderWithProviders } from "./test-utils";

// Halaman lazy diganti stub agar test fokus pada routing App.
vi.mock("./features/lost-founds/layouts/LostFoundLayout", async () => {
  const { Outlet } = await import("react-router-dom");
  return { default: () => <Outlet /> };
});
vi.mock("./features/lost-founds/pages/HomePage", () => ({
  default: () => <div>Home Stub</div>,
}));
vi.mock("./features/lost-founds/pages/DetailPage", () => ({
  default: () => <div>Detail Stub</div>,
}));
vi.mock("./features/users/pages/UsersPage", () => ({
  default: () => <div>Users Stub</div>,
}));
vi.mock("./features/users/pages/ProfilePage", () => ({
  default: () => <div>Profile Stub</div>,
}));

describe("App routing", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should render login page on /auth/login", async () => {
    renderWithProviders(<App />, { route: "/auth/login" });

    expect(await screen.findByText("Masuk Akun")).toBeInTheDocument();
    expect(screen.getByText("Daftar Baru")).toBeInTheDocument();
  });

  it("should render register page on /auth/register", async () => {
    renderWithProviders(<App />, { route: "/auth/register" });

    expect(await screen.findByText("Daftar Baru")).toHaveClass("text-blue-700");
  });

  it("should render home page on index route", async () => {
    renderWithProviders(<App />, { route: "/" });

    expect(await screen.findByText("Home Stub")).toBeInTheDocument();
  });

  it("should render detail page on /lost-founds/:id", async () => {
    renderWithProviders(<App />, { route: "/lost-founds/5" });

    expect(await screen.findByText("Detail Stub")).toBeInTheDocument();
  });

  it("should render users page on /users", async () => {
    renderWithProviders(<App />, { route: "/users" });

    expect(await screen.findByText("Users Stub")).toBeInTheDocument();
  });

  it("should render profile page on /profile", async () => {
    renderWithProviders(<App />, { route: "/profile" });

    expect(await screen.findByText("Profile Stub")).toBeInTheDocument();
  });

  it("should redirect unknown route to home", async () => {
    renderWithProviders(<App />, { route: "/halaman-tidak-ada" });

    expect(await screen.findByText("Home Stub")).toBeInTheDocument();
  });
});
