import { render, screen, waitFor } from '@testing-library/react';
import Page from '../../answers/[id]/page'

// mocking useParams -> "const { id } = useParams();"
jest.mock('next/navigation', () => ({
    useParams: () => ({ id: '123' }),
}));

// mocking navbar ( not original navbar component )
jest.mock('../../components/Navbar', () => {
    return function Navbar() {
        <div data-testid="navbar">Navbar</div>
    }
});

// mocking lottie-react...
jest.mock('lottie-react', () => ({
    __esModule: true,
    default: () => <div data-testid="loader" />
}));

// mocking toast...
jest.mock('sonner', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    }
}));

describe("Doubts Details Page", () => {
    beforeEach(() => {
        Storage.prototype.getItem = jest.fn(() =>
            JSON.stringify({ id: 'user123' })
        )

        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () =>
                    Promise.resolve({
                        doubt: [
                            { title: 'Test Doubt Title', description: 'Test doubt description' },
                        ],
                        answers: [
                            { _id: 'a1', text: 'This is a test answer', user: 'user123', createAt: new Date().toISOString() },
                        ],
                    })
            })
        );
    });

    afterEach(() => {
        jest.clearAllMocks()
    });

    test("renders doubts and answers correctly", async () => {
        render(<Page />)

        expect(screen.getByTestId('loader')).toBeInTheDocument();

        await waitFor(() =>
            expect(
                screen.getByText('Test Doubt Title')
            ).toBeInTheDocument()
        )

        expect(
            screen.getByText("Test doubt description")
        ).toBeInTheDocument();

        expect(
            screen.getByText('This is a test answer')
        ).toBeInTheDocument()

        // delete button should appear for owner
        expect(
            screen.getByText('Delete')
        ).toBeInTheDocument()
    })
})