import { screen } from "@testing-library/react";
import { renderRoute } from "../../../testUtils";
import { Login } from "shared/generated/routes/admin";
import { faker } from "@faker-js/faker";
import userEvent from "@testing-library/user-event";
import { MockedFunction } from "vitest";
import { UseNavigateResult } from "@tanstack/react-router";

describe("/admin/login", () => {
  let navigate: MockedFunction<UseNavigateResult<string>>;

  beforeEach(() => {
    const renderedPage = renderRoute({
      initialUrl: "/admin/login",
    });

    navigate = renderedPage.navigate;
  });
  it("renders the email input field", () => {
    const [emailInput] = screen.getAllByRole("textbox");

    expect(emailInput).toBeVisible();
    expect(emailInput).toHaveAttribute("type", "email");
  });

  it("renders the password input field", () => {
    const [_, passwordInput] = screen.getAllByRole("textbox");

    expect(passwordInput).toBeVisible();
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("renders the submit button", () => {
    const button = screen.getByRole("button");

    expect(button).toBeVisible();
    expect(button).toHaveTextContent("Submit");
  });

  describe("when the form is submitted", () => {
    it("submits the request with the provided input", async () => {
      const email = faker.internet.email();
      const password = faker.internet.password();

      const user = userEvent.setup();

      const [emailInput, passwordInput] = screen.getAllByRole("textbox");

      await user.type(emailInput, email);

      await user.type(passwordInput, password);

      await user.click(screen.getByRole("button"));

      expect(fetchMock).toHaveBeenCalledWith(Login.path, {
        method: Login.method,
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    });

    describe("when a success response is received", () => {
      const email = faker.internet.email();
      const password = faker.internet.password();

      beforeEach(async () => {
        fetchMock.mockResponse({
          status: 201,
          body: JSON.stringify({
            id: faker.string.alphanumeric(20),
          }),
        });

        const user = userEvent.setup();

        const [emailInput, passwordInput] = screen.getAllByRole("textbox");

        await user.type(emailInput, email);

        await user.type(passwordInput, password);

        await user.click(screen.getByRole("button"));
      });

      afterEach(() => {
        fetchMock.resetMocks();
      });

      it("navigates to the admin dashboard", () => {
        expect(navigate).toHaveBeenCalledWith({
          from: "/admin/login",
          to: "/admin/dashboard",
        });
      });
    });

    describe("when a error response is received", () => {
      const email = faker.internet.email();
      const password = faker.internet.password();
      const error = faker.lorem.sentence();

      beforeEach(async () => {
        fetchMock.mockResponse({
          status: 401,
          body: JSON.stringify({
            error,
          }),
        });

        const user = userEvent.setup();

        const [emailInput, passwordInput] = screen.getAllByRole("textbox");

        await user.type(emailInput, email);

        await user.type(passwordInput, password);

        await user.click(screen.getByRole("button"));
      });

      it("displays the error message", () => {
        const errorMessage = screen.getByRole("alert");

        expect(errorMessage).toHaveTextContent(error);
      });
    });
  });

  describe("when an invalid email is entered", () => {
    it("renders invalid email error text", async () => {
      const invalidEmail = faker.hacker.noun();
      const user = userEvent.setup();

      const [emailInput] = screen.getAllByRole("textbox");

      await user.type(emailInput, invalidEmail);

      expect(emailInput).toHaveAttribute("aria-invalid", "true");
      expect(emailInput).toHaveAccessibleErrorMessage("Invalid email address.");
    });
  });
});
