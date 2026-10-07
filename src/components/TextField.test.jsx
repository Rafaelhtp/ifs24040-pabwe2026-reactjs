import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TextField from "./TextField";

describe("TextField", () => {
  it("should render label bound to input", () => {
    render(<TextField id="email" label="Email" type="email" />);

    const input = screen.getByLabelText("Email");
    expect(input.tagName).toBe("INPUT");
    expect(input).toHaveAttribute("aria-invalid", "false");
    expect(input).not.toHaveAttribute("aria-describedby");
    expect(input).toHaveClass("pl-3.5");
  });

  it("should render textarea when multiline", () => {
    render(<TextField id="desc" label="Deskripsi" multiline />);

    expect(screen.getByLabelText("Deskripsi").tagName).toBe("TEXTAREA");
  });

  it("should render icon and adjust padding", () => {
    const Icon = (props) => <svg data-testid="icon" {...props} />;
    render(<TextField id="name" label="Nama" icon={Icon} />);

    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(screen.getByLabelText("Nama")).toHaveClass("pl-10");
  });

  it("should show error message and mark input invalid", () => {
    render(<TextField id="pass" label="Password" error="Wajib diisi" />);

    const input = screen.getByLabelText("Password");
    expect(screen.getByRole("alert")).toHaveTextContent("Wajib diisi");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", "pass-error");
    expect(input).toHaveClass("border-rose-400");
  });

  it("should forward input props and apply container class", () => {
    const onChange = vi.fn();
    const { container } = render(
      <TextField id="q" label="Cari" className="my-wrapper" placeholder="Ketik" onChange={onChange} />
    );

    fireEvent.change(screen.getByPlaceholderText("Ketik"), { target: { value: "a" } });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(container.firstChild).toHaveClass("my-wrapper");
  });
});
