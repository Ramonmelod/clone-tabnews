import retry from "async-retry";
import { faker } from "@faker-js/faker/.";
import database from "infra/database.js";
import migrator from "models/migrator.js";
import user from "models/user.js";

async function waitForAllServices() {
  await waitForWebServer();
  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
    }); // the retry module calls the function until it get no error

    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");
      if (response.status !== 200) {
        throw Error();
      }
    }
  }
}

async function clearDataBase() {
  await database.query("drop schema public cascade; create schema public;");
}

async function runPendingMigrations() {
  await migrator.runPendingMigrations();
}

async function createUser(userObject) {
  return await user.create({
    username:
      userObject?.username || faker.internet.username().replace(/[_.-]/g, ""), // fake.js create diferent fake username,
    email: userObject?.email || faker.internet.email(), // fake.js create diferent fake email
    password: userObject?.password || "validPassword",
  });
}

const orchestrator = {
  waitForAllServices,
  clearDataBase,
  runPendingMigrations,
  createUser,
};

export default orchestrator;
