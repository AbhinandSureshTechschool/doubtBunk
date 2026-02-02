import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Page from "../../(auth)/register/page";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// mocks
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

global.fetch = jest.fn();

describe("Register Page", () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    useRouter.mockReturnValue({ push: pushMock });
    fetch.mockClear();
    jest.clearAllMocks();
  });

  test("renders register form", () => {
    render(<Page />);

    expect(screen.getByText("Create an Account")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
  });

  test("updates input fields", () => {
    render(<Page />);

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Abhinand" },
    });

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });

    expect(screen.getByLabelText("Name").value).toBe("Abhinand");
    expect(screen.getByLabelText("Email").value).toBe("test@example.com");
    expect(screen.getByLabelText("Password").value).toBe("password123");
  });

  test("shows success toast and redirects on successful registration", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: "Account created successfully",
      }),
    });

    render(<Page />);

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "User" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "user@test.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
      expect(pushMock).toHaveBeenCalledWith("/login");
    });
  });

  test("shows error toast if registration fails", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        message: "Registration failed",
      }),
    });

    render(<Page />);

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Registration failed");
    });
  });

  test("shows generic error on fetch crash", async () => {
    fetch.mockRejectedValueOnce(new Error("Network error"));

    render(<Page />);

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Something went wrong");
    });
  });
});
