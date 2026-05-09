import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PasteUrlInput } from "@/components/PasteUrlInput";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe("<PasteUrlInput>", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders an input and submit button", () => {
    render(<PasteUrlInput />);
    expect(screen.getByPlaceholderText(/paste a polymarket url/i)).toBeInTheDocument();
  });

  it("posts to /api/markets/resolve-url and surfaces an error for unrecognized URLs", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: false,
        status: 400,
        json: async () => ({ error: "unrecognized_url" }),
      })) as unknown as typeof fetch
    );
    render(<PasteUrlInput />);
    const input = screen.getByPlaceholderText(/paste a polymarket url/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "https://kalshi.com/foo" } });
    fireEvent.submit(input.closest("form")!);
    await waitFor(() => {
      expect(screen.getByText(/Polymarket URL/i)).toBeInTheDocument();
    });
  });
});
