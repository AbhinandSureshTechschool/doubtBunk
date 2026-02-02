import { fireEvent, render, screen } from "@testing-library/react";
import Page from "../../(auth)/login/page";


const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: pushMock,
    }),
}));

const toastError = jest.fn();
const toastSuccess = jest.fn();

jest.mock("sonner", () => ({
    toast: {
        error: (...args) => toastError(...args),
        success: (...args) => toastSuccess(...args),
    },
}));


jest.mock("lottie-react", () => ({
    __esModule: true,
    default: () => <div data-testid="lottie-animation" />,
}));

jest.mock('../../components/LottieLoader', () => ({
    __esModule: true,
    default: () => <div data-testid="lottie-loader" />,
}));

jest.mock('../../components/LottieWelcome', () => ({
    __esModule: true,
    default: () => <div data-testid="lottie-welcome" />,
}));


describe("LoginPage", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders login form", () => {
        render(<Page />);

        expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();

    });

    test("allows user to type email and password", () => {
        render(<Page />);

        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'test@example.com' },
        });

        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: '123456' },
        });

        expect(screen.getByLabelText(/email/i)).toHaveValue("test@example.com");
        expect(screen.getByLabelText(/password/i)).toHaveValue("123456");
    });

    test("shows loader while submitting", async () => {
        global.fetch = jest.fn(() => new Promise(() => {}));

        render(<Page />);

        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: "test@example.com" },
        });

        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: "123456" },
        });

        fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
        expect(await screen.findByTestId("lottie-loader")).toBeInTheDocument();
    });

    test("shows welcome animation on successfull login", async () => {
        global.fetch = jest.fn(() => 
          Promise.resolve({
            ok: true,
            json: () => 
                Promise.resolve({
                    message: "Login successful",
                    user: { id: "1", name: "Test User" },
                })
              })
       );

       render(<Page />);

       fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: "test@example.com" },
       });

       fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: "123456" },
       });

       fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
       expect(await screen.findByTestId("lottie-welcome")).toBeInTheDocument();
    });
});