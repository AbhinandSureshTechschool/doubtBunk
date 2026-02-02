import DoubtModal from "../../components/DoubtModal"
import { fireEvent, render, screen } from "@testing-library/react"
import { toast } from 'sonner'

const pushMock = jest.fn();

jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: pushMock,
    })
}));

jest.mock("sonner", () => ({
    toast: {
        error: jest.fn(),
    }
}));

const mockOnClose = jest.fn();
const mockOnSubmit = jest.fn();

const renderModal = (props = {}) => {
    return render(
        <DoubtModal
            isOpen={true}
            onClose={mockOnClose}
            onSubmit={mockOnSubmit}
            {...props}
        />
    )
}


describe("DoubtModal", () => {

    // beforeEach(() => {
    //     localStorage.setItem(
    //         "doubtBunk",
    //         JSON.stringify({ id: "1", name: "User" })
    //     )
    // })

    test("component render test", async () => {
        renderModal();

        expect(screen.getByText(/add a/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/title/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/description/i)).toBeInTheDocument();
    });

    test("does not render modal when isOpen is false", () => {
        render(
            <DoubtModal
                isOpen={false}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        );

        expect(screen.queryByText(/add a/i)).not.toBeInTheDocument();
    });

    test("shows error and redirects if user not logged in", () => {
        renderModal();

        fireEvent.change(screen.getByPlaceholderText(/title/i), {
            target: { value: 'Test title' },
        });

        fireEvent.change(screen.getByPlaceholderText(/description/i), {
            target: { value: "Test description" },
        });

        fireEvent.click(screen.getByText(/add doubt/i));

        expect(toast.error).toHaveBeenCalledWith(
            "Please login before submitting..."
        );

        expect(pushMock).toHaveBeenCalledWith("/login");
        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test("submit doubt when user is logged in", () => {
        localStorage.setItem(
            "doubtBunk",
            JSON.stringify({ id: "1", name: "Test User"})
        );

        renderModal();

        fireEvent.change(screen.getByPlaceholderText(/title/i), {
            target: { value: "My Doubt" },
        });

        fireEvent.change(screen.getByPlaceholderText(/description/i), {
            target: { value: "This is a doubt description" },
        });

        fireEvent.click(screen.getByText(/add doubt/i));

        expect(mockOnSubmit).toHaveBeenCalledWith({
            title: "My Doubt",
            description: "This is a doubt description",
        });

        expect(mockOnClose).toHaveBeenCalled();
    });

    test("closes modal when clicking close button", () => {
        renderModal();
        fireEvent.click(screen.getByText('×'));
        expect(mockOnClose).toHaveBeenCalled();
    })

})