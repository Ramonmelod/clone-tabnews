import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDataBase();
});

describe("post api/v1/migrations", () => {
  describe("anonymous user", () => {
    describe("running pending migrations", () => {
      test("For the first time", async () => {
        const response = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
          },
        );

        expect(response.status).toBe(201);
        const responseBody = await response.json();

        expect(responseBody.length).toBeGreaterThan(0);
      });
      test("For the second time", async () => {
        const response2 = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
          },
        );

        expect(response2.status).toBe(200);
        const response2Body = await response2.json();

        expect(response2Body.length).toBe(0);
      });
    });
  });
});
