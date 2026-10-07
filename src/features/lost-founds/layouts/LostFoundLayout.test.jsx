import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor, act } from "@testing-library/react";
import { Routes, Route } from "react-router-dom";
import LostFoundLayout from "./LostFoundLayout";
import { renderWithProviders } from "../../../test-utils";
import { asyncSetProfile } from "../../users/states/action";

vi.mock("../../users/states/action", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, asyncSetProfile: vi.fn() };
});

const profile = { id: 1, name: "Budi", email: "budi@delcom.org" };

function renderLayout(options) {
  return renderWithProviders(
    <Routes>
      <Route path="/" element={<LostFoundLayout />}>
        <Route index element={<div>Outlet Stub</div>} />
      </Route>
      <Route path="/auth/login" element={<div>Login Stub</div>} />
    </Routes>,
    options
  );
}

describe("LostFoundLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    asyncSetProfile.mockImplementation(() => () => Promise.resolve(true));
  });

  it("should redirect to login when there is no token", () => {
    renderLayout();

    expect(screen.getByText("Login Stub")).toBeInTheDocument();
    expect(asyncSetProfile).not.toHaveBeenCalled();
  });

  it("should show verifying state while profile is loading", () => {
    localStorage.setItem("accessToken", "tok");
    asyncSetProfile.mockImplementation(() => () => new Promise(() => {}));

    renderLayout({ preloadedState: { profile: null, isProfile: false } });

    expect(screen.getByText("Memverifikasi sesi...")).toBeInTheDocument();
    expect(asyncSetProfile).toHaveBeenCalledTimes(1);
  });

  it("should remove token and redirect when profile verification fails", async () => {
    localStorage.setItem("accessToken", "tok");
    asyncSetProfile.mockImplementation(() => () => Promise.resolve(false));

    renderLayout({ preloadedState: { profile: null, isProfile: false } });

    expect(await screen.findByText("Login Stub")).toBeInTheDocument();
    expect(localStorage.getItem("accessToken")).toBeNull();
  });

  it("should ignore verification result after unmount", async () => {
    localStorage.setItem("accessToken", "tok");
    let resolveProfile;
    asyncSetProfile.mockImplementation(
      () => () =>
        new Promise((resolve) => {
          resolveProfile = resolve;
        })
    );

    const { unmount } = renderLayout({ preloadedState: { profile: null, isProfile: false } });
    unmount();
    await act(async () => {
      resolveProfile(false);
    });

    expect(localStorage.getItem("accessToken")).toBe("tok");
  });

  it("should render shell with outlet when profile is loaded", () => {
    localStorage.setItem("accessToken", "tok");

    renderLayout({ preloadedState: { profile } });

    expect(screen.getByText("Outlet Stub")).toBeInTheDocument();
    expect(screen.getByText("Lewati ke konten utama")).toBeInTheDocument();
    expect(screen.getByLabelText("Menu utama")).toBeInTheDocument();
    expect(asyncSetProfile).not.toHaveBeenCalled();
  });

  it("should render shell when profile request is already finished (isProfile)", () => {
    localStorage.setItem("accessToken", "tok");

    renderLayout({ preloadedState: { profile: null, isProfile: true } });

    expect(screen.getByText("Outlet Stub")).toBeInTheDocument();
  });

  it("should open and close sidebar from navbar toggle and backdrop", () => {
    localStorage.setItem("accessToken", "tok");
    renderLayout({ preloadedState: { profile } });

    expect(screen.queryByTestId("sidebar-backdrop")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Buka menu navigasi" }));
    expect(screen.getByTestId("sidebar-backdrop")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("sidebar-backdrop"));
    expect(screen.queryByTestId("sidebar-backdrop")).not.toBeInTheDocument();
  });

  it("should keep token when verification succeeds", async () => {
    localStorage.setItem("accessToken", "tok");

    renderLayout({ preloadedState: { profile: null, isProfile: true } });

    await waitFor(() => {
      expect(asyncSetProfile).toHaveBeenCalled();
    });
    expect(localStorage.getItem("accessToken")).toBe("tok");
  });
});
