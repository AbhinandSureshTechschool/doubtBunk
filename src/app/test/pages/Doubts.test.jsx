import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Page from "../../doubts/page"; 


jest.mock("../../components/Navbar", () => {
  return function Navbar() {
    return <div data-testid="navbar">Navbar</div>;
  };
});

jest.mock("../../components/DoubtGCard", () => {
  return function DoubtGCard({ title, description, addSoltuion }) {
    return (
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
        <button onClick={addSoltuion}>Add Solution</button>
      </div>
    );
  };
});

jest.mock("../../components/AddSolutionModal", () => {
  return function AddSolutionModal({ isOpen, onClose }) {
    return isOpen ? (
      <div data-testid="add-solution-modal">
        <button onClick={onClose}>Close</button>
      </div>
    ) : null;
  };
});

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

beforeEach(() => {
  jest.clearAllMocks();

  Storage.prototype.getItem = jest.fn(() =>
    JSON.stringify({ id: "user123" })
  );

  global.fetch = jest.fn().mockResolvedValue({
    json: async () => ({
      doubts: [{ _id: "1", title: "React state issue", description: "useState not updating" },],
    }),
  });
});

describe("Page Doubts List", () => {
  test("renders navbar and search input", async () => {
    render(<Page />);

    await screen.findByText("React state issue")

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  test("fetches and displays doubts", async () => {
    render(<Page />);

    expect(
      await screen.findByText("React state issue")
    ).toBeInTheDocument();

    expect(
      screen.getByText("useState not updating")
    ).toBeInTheDocument();
  });

  test("filters doubts using search input", async () => {
    render(<Page />);

    const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "react" } });

    expect(
      await screen.findByText("React state issue")
    ).toBeInTheDocument();
  });

  test("opens add solution modal when button clicked", async () => {
    render(<Page />);

    const button = await screen.findByText("Add Solution");

    fireEvent.click(button);

    expect(
      await screen.findByTestId("add-solution-modal")
    ).toBeInTheDocument();
  });
});
