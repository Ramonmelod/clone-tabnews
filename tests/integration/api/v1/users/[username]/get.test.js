import orchestrator from "tests/orchestrator.js";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDataBase();
  await orchestrator.runPendingMigrations();
});

describe("get api/v1/users/[username]", () => {
  describe("anonymous user", () => {
    test("With exact case match", async () => {
      const createdUser1 = await orchestrator.createUser({
        username: "sameCase",
      });

      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/sameCase",
      );

      expect(response2.status).toBe(200);

      const response2Body = await response2.json();

      expect(response2Body).toEqual({
        id: response2Body.id,
        username: "sameCase",
        email: createdUser1.email,
        password: response2Body.password,
        created_at: response2Body.created_at,
        updated_at: response2Body.updated_at,
      });

      expect(uuidVersion(response2Body.id)).toBe(4);
      expect(Date.parse(response2Body.created_at)).not.toBeNaN();
      expect(Date.parse(response2Body.updated_at)).not.toBeNaN();
    });

    test("With case mismatch", async () => {
      const createdUser2 = await orchestrator.createUser({
        username: "diferentCase",
      });

      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/Diferentcase",
      );

      expect(response2.status).toBe(200);

      const response2Body = await response2.json();

      expect(response2Body).toEqual({
        id: response2Body.id,
        username: "diferentCase",
        email: createdUser2.email,
        password: response2Body.password,
        created_at: response2Body.created_at,
        updated_at: response2Body.updated_at,
      });

      expect(uuidVersion(response2Body.id)).toBe(4);
      expect(Date.parse(response2Body.created_at)).not.toBeNaN();
      expect(Date.parse(response2Body.updated_at)).not.toBeNaN();
    });

    test("With nonexistent username", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/users/noRecordedUser",
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "O username informado não foi encontrado no sistema.",
        action: "verifique se o username está digitado corretamente.",
        status_code: 404,
      });
    });
  });
});
