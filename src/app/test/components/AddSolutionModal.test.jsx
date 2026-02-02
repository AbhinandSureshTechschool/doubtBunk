import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AddSolutionModal from "../../components/AddSolutionModal"
import userEvent from "@testing-library/user-event";
import { toast } from  "sonner";

jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    })
}));

jest.mock('lottie-react', () => ({
    __esModule: true,
    default: () => <div data-testid="lottie-mock" />
}));

jest.mock("sonner", () => ({
    toast: {
        error: jest.fn(),
        success: jest.fn()
    },
}));

describe("AddSolutionModal", () => {
    const mockOnClose = jest.fn();
    const mockOnSubmit = jest.fn().mockResolvedValueOnce(true);

    beforeEach(() => {
        localStorage.setItem(
            "doubtBunk",
            JSON.stringify({ id: "1", name: "User" })
        )
    })
    afterEach(() => {
        jest.clearAllMocks();
    })
    it('renders without crashing', () => {
        render(<AddSolutionModal />)
    })

    test("renders modal", () => {
        render(
            <AddSolutionModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        );
        expect(
            screen.getByText(/add solution/i)
        ).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText(/write your solution/i)
        ).toBeInTheDocument();
    });

    test("submits solution with upload video", async () => {
        global.fetch = jest.fn().mockResolvedValueOnce({
            json: async () => ({ url: "video.mp4" }),
        });

        render(
            <AddSolutionModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        );
        const textarea = screen.getByPlaceholderText(/write your solution/i);
        const fileInput = screen.getByTestId("file-input");
        const submitBtn = screen.getByText(/submit/i);

        await userEvent.type(textarea, "This is my solution");

        const file = new File(["video"], "video.mp4", { type: 'video/mp4' });
        fireEvent.change(fileInput, { target: { files: [file] } });

        await userEvent.click(submitBtn);

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith({
                text: "This is my solution",
                video: "video.mp4",
            });
        });
        expect(mockOnClose).toHaveBeenCalled();
    });


    test("Cancel button closes modal", async () => {
        render(<AddSolutionModal
               isOpen={true}
               onClose={mockOnClose}
               onSubmit={mockOnSubmit}
            />);
            const cancelBtn = screen.getByText(/cancel/i);
            await userEvent.click(cancelBtn);

            expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test("shows error if text is empty", async () => {
        render(
            <AddSolutionModal 
            isOpen={true}
            onClose={mockOnClose}
            onSubmit={mockOnSubmit}
            />
        );
        
        const submitBtn = screen.getByText(/submit/i);
        await userEvent.click(submitBtn);
        
        expect(toast.error).toHaveBeenCalledWith("please enter a valid text");
    })

});
