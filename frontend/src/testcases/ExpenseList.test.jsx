import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import ExpenseList from "../components/ExpenseList";

vi.mock("axios");

describe("ExpenseList", () => {
  it("shows empty state when API returns no expenses", async () => {
    axios.get.mockResolvedValueOnce({ data: { expenses: [] } });

    render(
      <MemoryRouter>
        <ExpenseList />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("No expenses found. Start adding one!")).toBeInTheDocument();
    });
  });
});
