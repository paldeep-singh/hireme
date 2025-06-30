import { faker } from "@faker-js/faker";
import {
	generateApiCompany,
	generateApiRole,
} from "@repo/api-types/testUtils/generators";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import nock from "nock";
import { serialize } from "tinyduration";
import { useAddRoleContext } from "../../../../forms/contexts/AddRoleContext";
import { renderRoute } from "../../../../testUtils";

const scope = nock(import.meta.env.VITE_API_URL);

vi.mock("../../../../forms/contexts/AddRoleContext");

const mockUseAddRoleContext = vi.mocked(useAddRoleContext);

afterEach(() => {
	vi.clearAllMocks();
	nock.cleanAll();
});

describe("/add-role/role", () => {
	const mockCompany = generateApiCompany();
	const mockSetRoleId = vi.fn();

	beforeEach(() => {
		mockUseAddRoleContext.mockReturnValue({
			companyId: mockCompany.id,
			roleId: null,
			setCompanyId: vi.fn(),
			setRoleId: mockSetRoleId,
		});
	});

	describe("Initial render", () => {
		beforeEach(() => {
			scope.persist().get("/api/admin/session/validate").reply(200);
		});

		it("displays the title field", async () => {
			renderRoute({
				initialUrl: "/add-role/role",
			});

			await waitFor(() => {
				expect(screen.getByLabelText("Title")).toHaveRole("textbox");
			});
		});

		it("displays the ad link field", async () => {
			renderRoute({
				initialUrl: "/add-role/role",
			});

			await waitFor(() => {
				expect(screen.getByLabelText("Ad link")).toHaveRole("textbox");
			});
		});

		it("displays the notes field", async () => {
			renderRoute({
				initialUrl: "/add-role/role",
			});

			await waitFor(() => {
				expect(screen.getByLabelText("Notes")).toHaveRole("textbox");
			});
		});
	});

	describe("Form submission", () => {
		const term = { months: 6 };
		const mockRole = generateApiRole(mockCompany.id, {
			type: "fixed_term",
			term: serialize(term),
		});

		describe("when the add role request is successful", () => {
			beforeEach(() => {
				scope
					.persist()
					.get("/api/admin/session/validate")
					.reply(200)
					.post(`/api/company/${mockCompany.id}/role`, {
						title: mockRole.title,
						ad_url: mockRole.ad_url,
						notes: mockRole.notes,
						type: mockRole.type,
						term: mockRole.term,
					})
					.reply(200, mockRole);
			});

			it("sets the roleId and navigates to the location form", async () => {
				const { navigate } = renderRoute({
					initialUrl: "/add-role/role",
				});

				const user = userEvent.setup();

				await waitFor(() => {
					expect(screen.getByLabelText("Title")).toBeVisible();
				});

				await user.type(screen.getByLabelText("Title"), mockRole.title);
				await user.type(screen.getByLabelText("Ad link"), mockRole.ad_url);
				await user.type(screen.getByLabelText("Notes"), mockRole.notes);
				await user.selectOptions(screen.getByLabelText("Type"), mockRole.type);

				await waitFor(() => {
					expect(screen.getByRole("group", { name: "Term" })).toBeVisible();
				});

				const termInput = screen.getByRole("group", { name: "Term" });

				await user.type(within(termInput).getByRole("spinbutton"), "6");
				await user.selectOptions(
					within(termInput).getByRole("combobox"),
					"months",
				);

				await user.click(screen.getByText("Next >"));

				await waitFor(() => {
					expect(nock.isDone()).toBe(true);
				});

				expect(mockSetRoleId).toHaveBeenCalledWith(mockRole.id);

				expect(navigate).toHaveBeenCalledWith({
					to: "/add-role/location",
				});
			});
		});

		describe("when there is an error adding the role", () => {
			const error = faker.hacker.phrase();

			beforeEach(() => {
				scope
					.persist()
					.get("/api/admin/session/validate")
					.reply(200)
					.post(`/api/company/${mockCompany.id}/role`, {
						title: mockRole.title,
						ad_url: mockRole.ad_url,
						notes: mockRole.notes,
						type: mockRole.type,
						term: mockRole.term,
					})
					.reply(500, {
						error,
					});
			});

			it("displays the error", async () => {
				renderRoute({
					initialUrl: "/add-role/role",
				});

				const user = userEvent.setup();

				await waitFor(() => {
					expect(screen.getByLabelText("Title")).toBeVisible();
				});

				await user.type(screen.getByLabelText("Title"), mockRole.title);
				await user.type(screen.getByLabelText("Ad link"), mockRole.ad_url);
				await user.type(screen.getByLabelText("Notes"), mockRole.notes);
				await user.selectOptions(screen.getByLabelText("Type"), mockRole.type);

				await waitFor(() => {
					expect(screen.getByRole("group", { name: "Term" })).toBeVisible();
				});

				const termInput = screen.getByRole("group", { name: "Term" });

				await user.type(within(termInput).getByRole("spinbutton"), "6");
				await user.selectOptions(
					within(termInput).getByRole("combobox"),
					"months",
				);

				await user.click(screen.getByText("Next >"));

				await waitFor(() => {
					expect(screen.getByRole("alert")).toHaveTextContent(
						`Error: ${error}`,
					);
				});

				expect(nock.isDone()).toBe(true);
			});
		});
	});
});
