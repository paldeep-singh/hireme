import { render, screen } from "@testing-library/react";
import { faker } from "@faker-js/faker";
import { ErrorBanner } from "../ErrorBanner";

describe("ErrorBanner", () => {
  it("renders the error when provided", () => {
    const error = faker.lorem.sentence();

    render(<ErrorBanner error={error} />);

    screen.getByText(`Error: ${error}`);
  });
});
