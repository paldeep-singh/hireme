import { createCompany, getCompanyByName } from "../companies";

it("createCompany", async () => {
  const result = await createCompany("test3");
  console.log(result);

  const company = await getCompanyByName("test3");

  expect(company.name).toBe("test3");
  console.log(company);
});
