import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import SidebarComponent, { MENU_ITEMS } from "./SidebarComponent";
import { renderWithProviders } from "../../../test-utils";

const ACTIVE = "bg-blue-700";

describe("SidebarComponent", () => {
  it("should render every menu item", () => {
    renderWithProviders(<SidebarComponent />);

    expect(MENU_ITEMS).toHaveLength(4);
    MENU_ITEMS.forEach((item) => {
      expect(screen.getByRole("link", { name: item.name })).toBeInTheDocument();
    });
    expect(screen.getByText("PABWE 2026")).toBeInTheDocument();
  });

  it("should mark dashboard as active on root path", () => {
    renderWithProviders(<SidebarComponent />, { route: "/" });

    expect(screen.getByRole("link", { name: "Dashboard / Laporan" })).toHaveClass(ACTIVE);
    expect(screen.getByRole("link", { name: "Statistik" })).not.toHaveClass(ACTIVE);
    expect(screen.getByRole("link", { name: "Pengguna" })).not.toHaveClass(ACTIVE);
  });

  it("should mark statistik as active (and not dashboard) on #statistik hash", () => {
    renderWithProviders(<SidebarComponent />, { route: "/#statistik" });

    expect(screen.getByRole("link", { name: "Statistik" })).toHaveClass(ACTIVE);
    expect(screen.getByRole("link", { name: "Dashboard / Laporan" })).not.toHaveClass(ACTIVE);
  });

  it("should mark users menu as active on /users", () => {
    renderWithProviders(<SidebarComponent />, { route: "/users" });

    expect(screen.getByRole("link", { name: "Pengguna" })).toHaveClass(ACTIVE);
    expect(screen.getByRole("link", { name: "Dashboard / Laporan" })).not.toHaveClass(ACTIVE);
  });

  it("should mark profile menu as active on /profile", () => {
    renderWithProviders(<SidebarComponent />, { route: "/profile" });

    expect(screen.getByRole("link", { name: "Profil Saya" })).toHaveClass(ACTIVE);
  });

  it("should not render backdrop when closed and keep sidebar off-screen", () => {
    renderWithProviders(<SidebarComponent isOpen={false} />);

    expect(screen.queryByTestId("sidebar-backdrop")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Menu utama")).toHaveClass("-translate-x-full");
  });

  it("should render backdrop when open and close on backdrop click", () => {
    const onClose = vi.fn();
    renderWithProviders(<SidebarComponent isOpen onClose={onClose} />);

    expect(screen.getByLabelText("Menu utama")).toHaveClass("translate-x-0");
    fireEvent.click(screen.getByTestId("sidebar-backdrop"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should call onClose from close button and when a link is clicked", () => {
    const onClose = vi.fn();
    renderWithProviders(<SidebarComponent isOpen onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: "Tutup menu navigasi" }));
    fireEvent.click(screen.getByRole("link", { name: "Pengguna" }));

    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("should not crash with default no-op onClose", () => {
    renderWithProviders(<SidebarComponent isOpen />);

    fireEvent.click(screen.getByTestId("sidebar-backdrop"));
    fireEvent.click(screen.getByRole("button", { name: "Tutup menu navigasi" }));

    expect(screen.getByLabelText("Menu utama")).toBeInTheDocument();
  });
});
