import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

test("test/integration/api/status/get.test.js response é 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  const parsedupdatedAt = new Date(responseBody.updated_at).toISOString(); // receives the value that comes from updated_at inside new Date()

  expect(responseBody.updated_at).toEqual(parsedupdatedAt);
  expect(responseBody.dependencies.database.version).toBe("15.0");
  expect(responseBody.dependencies.database.max_connections).toEqual(100);
  expect(responseBody.dependencies.database.open_connections).toEqual(1);
});
