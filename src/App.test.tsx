import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import App from "./App";

describe("Horizon app shell", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the safety disclaimer and persists a changed life stage", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByText("Simulated data. Not medical advice. Not diagnostic.")).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Life stage" })).toHaveValue("active");

    await user.selectOptions(screen.getByRole("combobox", { name: "Life stage" }), "retired");

    expect(screen.getByRole("combobox", { name: "Life stage" })).toHaveValue("retired");
    expect(window.localStorage.getItem("horizon:life-stage")).toBe('"retired"');
    expect(screen.getByText(/Retired astronaut/)).toBeInTheDocument();
  });

  it("changes the active view from the navigation", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getAllByRole("button", { name: /Trends/ })[0]);

    expect(screen.getByRole("heading", { name: "Your signals over time" })).toBeInTheDocument();
  });
});
