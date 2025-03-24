import { screen } from "@testing-library/react";
import { renderRoute } from "../../../testUtils";
import { Login } from "shared/generated/routes/admin";
import { faker } from "@faker-js/faker";
import userEvent from "@testing-library/user-event";
import { MockedFunction } from "vitest";
import { UseNavigateResult } from "@tanstack/react-router";
import { storeSessionCookie } from "../../../utils/sessionCookies";

vi.mock("../../../utils/sessionCookies");

const mockStoreSessionCookie = vi.mocked(storeSessionCookie);

afterEach(() => {
  vi.resetAllMocks();
});

describe("/admin/login", () => {
  it("renders the header", () => {
    renderRoute({
      initialUrl: "/admin/login",
    });

    expect(screen.getByText("Admin Login")).toBeVisible();
  });

  it("renders the email input field", () => {
    renderRoute({
      initialUrl: "/admin/login",
    });

    const [emailInput] = screen.getAllByRole("textbox");

    expect(emailInput).toBeVisible();
    expect(emailInput).toHaveAttribute("type", "email");
  });

  it("renders the password input field", () => {
    renderRoute({
      initialUrl: "/admin/login",
    });

    const [_, passwordInput] = screen.getAllByRole("textbox");

    expect(passwordInput).toBeVisible();
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("renders the submit button", () => {
    renderRoute({
      initialUrl: "/admin/login",
    });

    const button = screen.getByRole("button");

    expect(button).toBeVisible();
    expect(button).toHaveTextContent("Submit");
  });

  describe("when the form is submitted", () => {
    it("submits the request with the provided input", async () => {
      fetchMock.mockResponse({
        status: 201,
        body: JSON.stringify({
          id: faker.string.alphanumeric(20),
        }),
      });

      renderRoute({
        initialUrl: "/admin/login",
      });

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
      describe("when the page was visited directly", () => {
        const email = faker.internet.email();
        const password = faker.internet.password();

        const sessionId = faker.string.alphanumeric(20);

        let navigate: MockedFunction<UseNavigateResult<string>>;
        beforeEach(async () => {
          const page = renderRoute({
            initialUrl: "/admin/login",
          });

          navigate = page.navigate;

          fetchMock.mockResponse({
            status: 201,
            body: JSON.stringify({
              id: sessionId,
            }),
          });

          const user = userEvent.setup();

          const [emailInput, passwordInput] = screen.getAllByRole("textbox");

          await user.type(emailInput, email);

          await user.type(passwordInput, password);

          await user.click(screen.getByRole("button"));
        });

        it("stores the session cookie", () => {
          expect(mockStoreSessionCookie).toHaveBeenCalledExactlyOnceWith({
            id: sessionId,
          });
        });

        it("navigates to the admin dashboard", () => {
          expect(navigate).toHaveBeenCalledWith({
            from: "/admin/login",
            to: "/admin/dashboard",
          });
        });
      });
    });

    describe("when a error response is received", () => {
      const email = faker.internet.email();
      const password = faker.internet.password();
      const error = faker.lorem.sentence();

      beforeEach(async () => {
        renderRoute({
          initialUrl: "/admin/login",
        });

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
      renderRoute({
        initialUrl: "/admin/login",
      });

      const invalidEmail = faker.hacker.noun();
      const user = userEvent.setup();

      const [emailInput] = screen.getAllByRole("textbox");

      await user.type(emailInput, invalidEmail);

      expect(emailInput).toHaveAttribute("aria-invalid", "true");
      expect(emailInput).toHaveAccessibleErrorMessage("Invalid email address.");
    });
  });

  describe("when the user was redirected from a different page", () => {
    const email = faker.internet.email();
    const password = faker.internet.password();

    let navigate: MockedFunction<UseNavigateResult<string>>;

    const otherPageRoute = "/other/page";

    const errorMessage = faker.hacker.phrase();

    beforeEach(() => {
      fetchMock.mockResponse({
        status: 201,
        body: JSON.stringify({
          id: faker.string.alphanumeric(20),
        }),
      });
    });

    afterEach(() => {
      fetchMock.resetMocks();
    });

    it("displays the error", () => {
      const page = renderRoute({
        initialUrl: "/admin/login/",
        initialSearch: {
          redirect: otherPageRoute,
          error: errorMessage,
        },
      });

      expect(screen.getByRole("alert")).toBeVisible();
      expect(screen.getByRole("alert")).toHaveTextContent(
        `Error: ${errorMessage}`,
      );
    });

    it("navigates to the previous page", async () => {
      const page = renderRoute({
        initialUrl: "/admin/login/",
        initialSearch: {
          redirect: otherPageRoute,
          error: errorMessage,
        },
      });

      navigate = page.navigate;

      const user = userEvent.setup();

      const [emailInput, passwordInput] = screen.getAllByRole("textbox");

      await user.type(emailInput, email);

      await user.type(passwordInput, password);

      await user.click(screen.getByRole("button"));

      expect(navigate).toHaveBeenCalledWith({
        from: "/admin/login",
        to: otherPageRoute,
      });
    });
  });
});
