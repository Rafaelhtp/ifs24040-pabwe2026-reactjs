import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import NavbarComponent from "..components/NavbarComponent";
import { renderWithProviders } from "../../../test-utils";
import { asyncSetIsAuthLogout } from "../../auth/states/action";
import { showConfirmDialog } from "../../../helpers/toolsHelper";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

const withUnwrap = (value) =>
  Object.assign(Promise.resolve(value), { unwrap: () => Promise.resolve(value) });

vi.mock("../../auth/states/action", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    asyncSetIsAuthLogout: vi.fn(() => () => withUnwrap(true)),
  };
});

vi.mock("../../../helpers/toolsHelper", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, showConfirmDialog: vi.fn() };
});

const profile = { id: 1, name: "Budi", email: "budi@delcom.org", photo: null };

describe("NavbarComponent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render brand and profile name", () => {
    renderWithProviders(<NavbarComponent onToggleSidebar={() => {}} />, {
      preloadedState: { profile },
    });

    expect(screen.getByText("Sesi aktif")).toBeInTheDocument();
    expect(screen.getByText("Budi")).toBeInTheDocument();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("should fall back to default name when profile is empty", () => {
    renderWithProviders(<NavbarComponent onToggleSidebar={() => {}} />, {
      preloadedState: { profile: null },
    });

    expect(screen.getByText("Pengguna")).toBeInTheDocument();
  });

  it("should call onToggleSidebar from hamburger button", () => {
    const onToggleSidebar = vi.fn();
    renderWithProviders(<NavbarComponent onToggleSidebar={onToggleSidebar} />, {
      preloadedState: { profile },
    });

    fireEvent.click(screen.getByRole("button", { name: "Buka menu navigasi" }));

    expect(onToggleSidebar).toHaveBeenCalledTimes(1);
  });

  it("should toggle dropdown with profile details", () => {
    renderWithProviders(<NavbarComponent onToggleSidebar={() => {}} />, {
      preloadedState: { profile },
    });
    const trigger = screen.getByRole("button", { name: "Menu profil" });

    fireEvent.click(trigger);
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getByText("budi@delcom.org")).toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(trigger);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("should show placeholders in dropdown when profile has no data", () => {
    renderWithProviders(<NavbarComponent onToggleSidebar={() => {}} />, {
      preloadedState: { profile: null },
    });

    fireEvent.click(screen.getByRole("button", { name: "Menu profil" }));

    expect(screen.getByText("-")).toBeInTheDocument();
    expect(screen.getAllByText("Pengguna").length).toBeGreaterThan(1);
  });

  it("should close dropdown when backdrop is clicked", () => {
    renderWithProviders(<NavbarComponent onToggleSidebar={() => {}} />, {
      preloadedState: { profile },
    });

    fireEvent.click(screen.getByRole("button", { name: "Menu profil" }));
    fireEvent.click(screen.getByTestId("dropdown-backdrop"));

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("should close dropdown when profile link is clicked", () => {
    renderWithProviders(<NavbarComponent onToggleSidebar={() => {}} />, {
      preloadedState: { profile },
    });

    fireEvent.click(screen.getByRole("button", { name: "Menu profil" }));
    fireEvent.click(screen.getByRole("menuitem", { name: /Profil Saya/ }));

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("should logout and redirect when confirmed", async () => {
    showConfirmDialog.mockResolvedValue({ isConfirmed: true });
    renderWithProviders(<NavbarComponent onToggleSidebar={() => {}} />, {
      preloadedState: { profile },
    });

    fireEvent.click(screen.getByRole("button", { name: "Menu profil" }));
    fireEvent.click(screen.getByRole("menuitem", { name: /Keluar/ }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/auth/login", { replace: true });
    });
    expect(showConfirmDialog).toHaveBeenCalled();
    expect(asyncSetIsAuthLogout).toHaveBeenCalledTimes(1);
  });

  it("should stay logged in when confirmation is cancelled", async () => {
    showConfirmDialog.mockResolvedValue({ isConfirmed: false });
    renderWithProviders(<NavbarComponent onToggleSidebar={() => {}} />, {
      preloadedState: { profile },
    });

    fireEvent.click(screen.getByRole("button", { name: "Menu profil" }));
    fireEvent.click(screen.getByRole("menuitem", { name: /Keluar/ }));

    await waitFor(() => {
      expect(showConfirmDialog).toHaveBeenCalled();
    });
    expect(asyncSetIsAuthLogout).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
