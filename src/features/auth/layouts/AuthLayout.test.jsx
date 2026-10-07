import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import AuthLayout from "./AuthLayout";
import { renderWithProviders } from "../../../test-utils";
import apiHelper from "../../../helpers/apiHelper";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("AuthLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render branding and tabs", () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue(null);

    renderWithProviders(<AuthLayout />, {
      preloadedState: {
        profile: null,
      },
    });

    expect(screen.getByText("Delcom Todo")).toBeInTheDocument();
    expect(screen.getByText("Masuk Akun")).toBeInTheDocument();
    expect(screen.getByText("Daftar Baru")).toBeInTheDocument();
  });

  it("should navigate to home if user already logged in with profile", () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue("valid-token");

    renderWithProviders(<AuthLayout />, {
      preloadedState: {
        profile: { id: 1, name: "Logged In User" },
        isProfile: true,
      },
    });

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("should stay on auth layout if isProfile is true but profile is null", () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue(null);

    renderWithProviders(<AuthLayout />, {
      preloadedState: {
        profile: null,
        isProfile: true,
      },
    });

    expect(screen.getByText("Masuk Akun")).toBeInTheDocument();
  });

  it("should highlight register tab when on register route", () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue(null);

    renderWithProviders(<AuthLayout />, {
      route: "/auth/register",
      preloadedState: { profile: null },
    });

    expect(screen.getByText("Daftar Baru")).toHaveClass("text-blue-700");
    expect(screen.getByText("Masuk Akun")).not.toHaveClass("text-blue-700");
  });

  it("should highlight login tab when on login route", () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue(null);

    renderWithProviders(<AuthLayout />, {
      route: "/auth/login",
      preloadedState: { profile: null },
    });

    expect(screen.getByText("Masuk Akun")).toHaveClass("text-blue-700");
    expect(screen.getByText("Daftar Baru")).not.toHaveClass("text-blue-700");
  });
});
