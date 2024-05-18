import database from "infra/database";

test("test/integration/api/migrations/get.test.js response é 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  console.log(responseBody);
  expect(Array.isArray(responseBody)).toBe(true);
  expect(responseBody.length).toBeGreaterThan(0); //see if the response comes empty
});
