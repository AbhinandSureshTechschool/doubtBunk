import { fireEvent, render, screen } from "@testing-library/react";
import DoubtEditModal from "../../components/DoubtEditModal";


const mockOnClose = jest.fn();
const mockOnSubmit = jest.fn();

const mockDoubt = {
    _id: "123",
    title: "Old Title",
    description: "Old Description"
};

const renderModal = (props = {}) => {
    return render(
        <DoubtEditModal
            isOpen={true}
            onClose={mockOnClose}
            onSubmit={mockOnSubmit}
            doubt={mockDoubt}
            {...props}
        />
    );
};

beforeEach(() => {
    jest.clearAllMocks();
});

describe("DoubtEditModal", () => {
    test('renders modal when open', () => {
        renderModal();

        expect(screen.getByText(/edit doubt/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/title/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/description/i)).toBeInTheDocument();
    });

    test("does not render modal when isOpen is false", () => {
        render(
            <DoubtEditModal
                isOpen={false}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
                doubt={mockDoubt}
            />
        );

        expect(screen.queryByText(/edit doubt/i)).not.toBeInTheDocument();
    });

    test("pre-fills title and description from doubt prop", () => {
        renderModal();

        expect(screen.getByPlaceholderText(/title/i)).toHaveValue("Old Title");
        expect(screen.getByPlaceholderText(/description/i)).toHaveValue(
            "Old Description"
        );
    });

    test("updates input values when typing", () => {
        renderModal();

        fireEvent.change(screen.getByPlaceholderText(/title/i), {
            target: { value: "New Title" },
        });

        fireEvent.change(screen.getByPlaceholderText(/description/i), {
            target: { value: "New Description" }
        })

        expect(screen.getByPlaceholderText(/title/i)).toHaveValue("New Title");
        expect(screen.getByPlaceholderText(/description/i)).toHaveValue("New Description");
    });

    test("submits edited doubt with id", () => {
        renderModal();

        fireEvent.change(screen.getByPlaceholderText(/title/i), {
            target: { value: "Updated Title" }
        });

        fireEvent.change(screen.getByPlaceholderText(/description/i), {
            target: { value: "Updated Description" },
        });

        fireEvent.click(screen.getByText(/edit doubt/i));

        expect(mockOnSubmit).toHaveBeenCalledWith({
            id: '123',
            title: 'Updated Title',
            description: 'Updated Description'
        });
        expect(mockOnClose).toHaveBeenCalled();
    });

    test("closes modal when clicking close button", () => {
       renderModal();
       fireEvent.click(screen.getByText('×'));
       expect(mockOnClose).toHaveBeenCalled();
    });

});