import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";

export default async function migrations(request, response) {
  const allowedMethods = ["GET", "POST"];
  if (!allowedMethods.includes(request.method)) {
    response
      .status(405)
      .json({ error: `Method ${request.method} is not allowed!` });
  }
  let dbClient;
  try {
    dbClient = await database.getNewClient(); // recebe a conexão com o banco de dados vinda de getNewClient
    if (request.method === "GET") {
      const migrations = await migrationRunner({
        dbClient: dbClient,
        dryRun: true,
        dir: join("infra", "migrations"), // metodo join aplicado ao path para que caminho seja resolvido para diferentes S.O
        direction: "up", // direção da migration (down)
        verbose: true,
        migrationsTable: "pgmigrations", // define a tabela de regitro das migrations
      });
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
      response.status(200).json(migrations);
    }
  } catch (error) {
    console.error(error);
  } finally {
    await dbClient.end(); //closing connection opened in dbClient to avoid opened connections for other methods
  }
}
