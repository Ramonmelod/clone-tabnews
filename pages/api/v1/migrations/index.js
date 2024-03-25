import migrationRunner from "node-pg-migrate";
import { join } from "node:path";

export default async function migrations(request, response) {
  const migrations = await migrationRunner({
    databaseUrl: process.env.DATABASE_URL,
    dryRun: true,
    dir: join("infra", "migrations"), // metodo join aplicado ao path para que caminho seja resolvido para diferentes S.O
    direction: "up", // direção da migration
    verbose: true,
    migrationsTable: "pgmigrations", // define a tabela de regitro das migrations
  });
  response.status(200).json(migrations);
}
