import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database";

const defaultMigrationOptions = {
  dryRun: true,
  dir: resolve("infra", "migrations"), // metodo resolve aplicado ao path para que caminho seja resolvido para diferentes S.O
  direction: "up", // direção da migration
  logs: () => {},
  migrationsTable: "pgmigrations", // define a tabela de regitro das migrations
};

async function listPendingMigrations() {
  let dbClient;
  try {
    dbClient = await database.getNewClient(); // recebe a conexão com o banco de dados vinda de getNewClient

    const migrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient, //dbClient: dbClient,
    });
    return migrations;
  } finally {
    await dbClient?.end(); //closing connection opened in dbClient to avoid opened connections for other methods
  }
}

async function runPendingMigrations() {
  let dbClient;
  try {
    dbClient = await database.getNewClient(); // recebe a conexão com o banco de dados vinda de getNewClient

    const migrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient, //dbClient: dbClient,
      dryRun: false,
    });

    if (migrations.length > 0) {
      return migrations;
    }

    return migrations;
  } finally {
    await dbClient?.end(); //closing connection opened in dbClient to avoid opened connections for other methods
  }
}

const migrator = {
  listPendingMigrations,
  runPendingMigrations,
};
export default migrator;
