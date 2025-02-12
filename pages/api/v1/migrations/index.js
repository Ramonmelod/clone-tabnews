import { createRouter } from "next-connect";
import controller from "infra/controller";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database";

const router = createRouter();
export default router.handler(controller.errorHandlers);

router.get(getHandler).post(postHandler);

const defaultMigrationOptions = {
  dryRun: false,
  dir: resolve("infra", "migrations"), // metodo resolve aplicado ao path para que caminho seja resolvido para diferentes S.O
  direction: "up", // direção da migration
  verbose: true,
  migrationsTable: "pgmigrations", // define a tabela de regitro das migrations
};

async function getHandler(request, response) {
  let dbClient;
  try {
    dbClient = await database.getNewClient(); // recebe a conexão com o banco de dados vinda de getNewClient

    const migrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient, //dbClient: dbClient,
    });
    return response.status(200).json(migrations);
  } finally {
    await dbClient?.end(); //closing connection opened in dbClient to avoid opened connections for other methods
  }
}

async function postHandler(request, response) {
  let dbClient;
  try {
    dbClient = await database.getNewClient(); // recebe a conexão com o banco de dados vinda de getNewClient

    const migrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient, //dbClient: dbClient,
    });

    if (migrations.length > 0) {
      return response.status(201).json(migrations);
    }

    return response.status(200).json(migrations);
  } finally {
    await dbClient?.end(); //closing connection opened in dbClient to avoid opened connections for other methods
  }
}
