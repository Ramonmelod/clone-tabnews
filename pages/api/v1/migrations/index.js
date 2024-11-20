import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";

export default async function migrations(request, response) {
  const dbClient = await database.getNewClient(); // recebe a conexão com o banco de dados vinda de getNewClient
  if (request.method === "GET") {
    const migrations = await migrationRunner({
      dbClient: dbClient,
      dryRun: true,
      dir: join("infra", "migrations"), // metodo join aplicado ao path para que caminho seja resolvido para diferentes S.O
      direction: "up", // direção da migration (down)
      verbose: true,
      migrationsTable: "pgmigrations", // define a tabela de regitro das migrations
    });
    await dbClient.end();
    return response.status(200).json(migrations);
  }
  if (request.method === "POST") {
    const migrations = await migrationRunner({
      dbClient: dbClient,
      dryRun: false,
      dir: join("infra", "migrations"), // metodo join aplicado ao path para que caminho seja resolvido para diferentes S.O
      direction: "up", // direção da migration
      verbose: true,
      migrationsTable: "pgmigrations", // define a tabela de regitro das migrations
    });
    await dbClient.end();
    response.status(200).json(migrations);
  }
  response.status(405).end();
}
