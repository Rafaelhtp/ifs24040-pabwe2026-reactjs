import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Avatar from "./Avatar";

describe("Avatar", () => {
  it("should render image when photo is provided", () => {
    render(<Avatar name="Budi" photo="https://example.com/budi.png" />);

    const img = screen.getByRole("img", { name: "Foto Budi" });
    expect(img).toHaveAttribute("src", "https://example.com/budi.png");
    expect(img).toHaveClass("h-8");
  });

  it("should use generic alt when name is missing", () => {
    render(<Avatar photo="https://example.com/x.png" />);

    expect(screen.getByRole("img", { name: "Foto pengguna" })).toBeInTheDocument();
  });

  it("should render uppercase initial when there is no photo", () => {
    render(<Avatar name="ani" size="lg" />);

    const initial = screen.getByText("A");
    expect(initial).toHaveClass("h-24");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("should fall back to U when name is empty", () => {
    render(<Avatar name="" photo={null} size="md" />);

    expect(screen.getByText("U")).toHaveClass("h-12");
  });

  it("should use small size when size is unknown", () => {
    render(<Avatar name="Cici" size="xxl" />);

    expect(screen.getByText("C")).toHaveClass("h-8");
  });
});
