import { render, screen, waitFor } from "@testing-library/react";
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
    expect(screen.getByText("Post-mission workspace")).toBeInTheDocument();
  });

  it("changes the active view from the navigation", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getAllByRole("button", { name: /Trends/ })[0]);

    expect(screen.getByRole("heading", { name: "Your signals over time" })).toBeInTheDocument();
  });

  it("explains a recovery concern in plain language", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Profile" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Demo scenario" }), "recovery_concern");
    expect(screen.getByText("Loading simulated signals…")).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText("Loading simulated signals…")).not.toBeInTheDocument());
    await user.click(screen.getAllByRole("button", { name: "Home" })[0]);

    expect(screen.getByText("Watch")).toBeInTheDocument();
    expect(screen.getByText(/Sleep was below your usual range on 4 of the last 5 days/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Take the optional wellbeing check-in/ })).toBeInTheDocument();
  });

  it("shows a separate stale-data explanation", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Profile" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Demo scenario" }), "stale");
    await waitFor(() => expect(screen.queryByText("Loading simulated signals…")).not.toBeInTheDocument());
    await user.click(screen.getAllByRole("button", { name: "Trends" })[0]);

    expect(screen.getByText(/These readings are stale/)).toBeInTheDocument();
    expect(screen.getByText(/charts remain visible for context/)).toBeInTheDocument();
  });

  it("opens the plain-language reason for a trend alert", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Profile" }));
    await user.selectOptions(screen.getByRole("combobox", { name: "Demo scenario" }), "recovery_concern");
    await waitFor(() => expect(screen.queryByText("Loading simulated signals…")).not.toBeInTheDocument());
    await user.click(screen.getAllByRole("button", { name: "Trends" })[0]);
    await user.click(screen.getByRole("button", { name: "Show alert reason" }));

    expect(screen.getByText(/Sleep was below your usual range on 4 of the last 5 days/)).toBeInTheDocument();
  });

  it("saves a wellbeing check-in to local storage", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getAllByRole("button", { name: "Wellbeing" })[0]);
    await user.selectOptions(screen.getByRole("combobox", { name: "Mood" }), "4");
    await user.selectOptions(screen.getByRole("combobox", { name: "Stress" }), "2");
    await user.type(screen.getByRole("textbox", { name: "Optional note" }), "Felt steady after exercise.");
    await user.click(screen.getByRole("button", { name: "Save check-in locally" }));

    expect(screen.getByText("Saved on this device")).toBeInTheDocument();
    expect(window.localStorage.getItem("horizon:wellbeing")).toContain("Felt steady after exercise.");
  });

  it("opens local support options without sending a message", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getAllByRole("button", { name: "Wellbeing" })[0]);
    await user.click(screen.getByRole("button", { name: "Open support options" }));

    expect(screen.getByRole("region", { name: "Support options" })).toBeInTheDocument();
    expect(screen.getByText("Crew medic")).toBeInTheDocument();
    expect(screen.getByText(/This demo does not send messages/)).toBeInTheDocument();
  });
});
