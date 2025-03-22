import { render, screen } from "@testing-library/react";
import { SubmitButton } from "../SubmitButton";
import { faker } from "@faker-js/faker";

describe("SubmitButton", () => {
  const label = faker.lorem.word();

  it("renders the label", () => {
    render(<SubmitButton label={label} loading={false} />);

    expect(screen.getByText(label)).toBeVisible();
  });

  describe("when loading is true", () => {
    it("renders the loading indicator", () => {
      render(<SubmitButton label={label} loading={true} />);

      expect(screen.getByLabelText("loading")).toBeVisible();
    });
  });

  describe("when loading is false", () => {
    it("does not render the loading indicator", () => {
      render(<SubmitButton label={label} loading={false} />);

      expect(screen.queryByLabelText("loading")).toBeNull();
    });
  });
});
