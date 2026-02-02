import { render, screen } from "@testing-library/react";
import LottieLoader from "../../components/LottieLoader";


jest.mock('lottie-react', () => ({
    __esModule: true,
    default: () => <div data-testid="lottie-animation" />,
}));

describe("LottieLoader", () => {
    test("render the loader overlay", () => {
        render(<LottieLoader />);

        expect(
            screen.getByTestId("lottie-animation")
        ).toBeInTheDocument();
        expect(screen.getByTestId("loader-overlay")).toBeInTheDocument();
    });
});