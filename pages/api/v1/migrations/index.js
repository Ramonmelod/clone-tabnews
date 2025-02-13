import { createRouter } from "next-connect";
import controller from "infra/controller";
import migrator from "models/migrator.js";

const router = createRouter();
export default router.handler(controller.errorHandlers);

router.get(getHandler).post(postHandler);

async function getHandler(request, response) {
  const migrations = await migrator.listPendingMigrations();
  return response.status(200).json(migrations);
}

async function postHandler(request, response) {
  const migrations = await migrator.runPendingMigrations();

  if (migrations.length > 0) {
    return response.status(201).json(migrations);
  }

  return response.status(200).json(migrations);
}
