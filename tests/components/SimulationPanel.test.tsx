import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SimulationPanel } from "@/components/SimulationPanel";

describe("<SimulationPanel>", () => {
  it("renders nothing before run is clicked", () => {
    render(
      <SimulationPanel slug="x" question="Q?" yesProbability={0.5} />
    );
    expect(screen.queryByText(/observed/i)).not.toBeInTheDocument();
  });

  it("running 100 sims renders observed/implied bars", () => {
    render(
      <SimulationPanel slug="x" question="Q?" yesProbability={0.5} />
    );
    fireEvent.click(screen.getByRole("button", { name: /run 100/i }));
    expect(screen.getByText(/Implied:/i)).toBeInTheDocument();
    expect(screen.getByText(/Observed:/i)).toBeInTheDocument();
  });

  it("calls onSimulationComplete with the result", () => {
    const onComplete = vi.fn();
    render(
      <SimulationPanel
        slug="x"
        question="Q?"
        yesProbability={1}
        onSimulationComplete={onComplete}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /run 100/i }));
    expect(onComplete).toHaveBeenCalledTimes(1);
    const arg = onComplete.mock.calls[0][0];
    expect(arg.n).toBe(100);
    expect(arg.yesCount).toBe(100);
  });
});
