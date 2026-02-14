import { render, screen } from '@testing-library/react';
import  LottieWelcome  from '../../components/LottieWelcome';


jest.mock("lottie-react", () => ({
    __esModule: true,
    default: () => <div data-testid="lottie-animation" />
}));

describe("LottieWelcome", () => {
    test("renders the loader overlay", () => {
        render(<LottieWelcome />);

        expect(screen.getByTestId("lottie-animation")).toBeInTheDocument();
        expect(screen.getByTestId("loader-overlay")).toBeInTheDocument();
    });
});
