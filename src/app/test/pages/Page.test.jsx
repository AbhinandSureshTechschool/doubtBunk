import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Home from "@/app/page";


jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("../../components/Navbar", () => {
  return function Navbar() {
    return <div data-testid="navbar">Navbar</div>;
  };
});

jest.mock("../../components/DoubtModal", () => {
  return function DoubtModal({ isOpen }) {
    return isOpen ? (
      <div data-testid="doubt-modal">Doubt Modal</div>
    ) : null;
  };
});

jest.mock("../../components/DoubtEditModal", () => {
  return function DoubtEditModal({ isOpen }) {
    return isOpen ? (
      <div data-testid="edit-doubt-modal">Edit Doubt</div>
    ) : null;
  };
});

jest.mock("../../components/DoubtCard", () => {
  return function DoubtCard({ title, description }) {
    return (
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    );
  };
});

jest.mock("../../components/LottieLoader", () => {
  return function Loader() {
    return <div data-testid="loader">Loading...</div>;
  };
});

beforeEach(() => {
  jest.clearAllMocks();

  Storage.prototype.getItem = jest.fn(() =>
    JSON.stringify({ id: "user123" })
  );

  global.fetch = jest.fn().mockResolvedValue({
    json: async () => ({ doubts: [] }),
  });
});

describe("Home Page", () => {
  test("renders navbar and hero text", async () => {
    render(<Home />);

    expect(await screen.findByTestId("navbar")).toBeInTheDocument();
    expect(
      screen.getByText(/Clear Your Doubts/i)
    ).toBeInTheDocument();
  });

  test("opens add doubt modal", async () => {
    render(<Home />);

    fireEvent.click(
      await screen.findByRole("button", { name: /add doubt/i })
    );

    expect(
      await screen.findByTestId("doubt-modal")
    ).toBeInTheDocument();
  });
});
