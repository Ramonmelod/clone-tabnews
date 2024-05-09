import migrationRunner from "node-pg-migrate";
import { join } from "node:path";

export default async function migrations(request, response) {
  if (request.method === "GET") {
    const migrations = await migrationRunner({
      databaseUrl: process.env.DATABASE_URL,
      dryRun: true,
      dir: join("infra", "migrations"), // metodo join aplicado ao path para que caminho seja resolvido para diferentes S.O
      direction: "up", // direção da migration
      verbose: true,
      migrationsTable: "pgmigrations", // define a tabela de regitro das migrations
    });
    return response.status(200).json(migrations);
  }
  if (request.method === "POST") {
    const migrations = await migrationRunner({
      databaseUrl: process.env.DATABASE_URL,
      dryRun: false,
      dir: join("infra", "migrations"), // metodo join aplicado ao path para que caminho seja resolvido para diferentes S.O
      direction: "up", // direção da migration
      verbose: true,
      migrationsTable: "pgmigrations", // define a tabela de regitro das migrations
    });
    response.status(200).json(migrations);
  }
  response.status(405).end();
}
