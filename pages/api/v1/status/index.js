import database from "infra/database";

import { InternalServerError } from "infra/errors";
async function status(request, response) {
  const updatedAt = new Date().toISOString();

  try {
    const dataBaseVersionResult = await database.query("show server_version;"); //controller
    const dataBaseVersionValue = dataBaseVersionResult.rows[0].server_version;

    const dataBaseMaxConnectionsResult = await database.query(
      "show MAX_CONNECTIONS;",
    );
    const dataBaseMaxConnectionsValue =
      dataBaseMaxConnectionsResult.rows[0].max_connections;

    const databaseName = process.env.POSTGRES_DB;
    const databaseOpennedConnectionsResult = await database.query({
      // está também é a forma automatizada em que o node-postgres sanitiza a query
      text: "SELECT count(*)::int FROM pg_stat_activity where datname = $1",
      values: [databaseName],
    });

    const databaseOpennedConnectionsValue =
      databaseOpennedConnectionsResult.rows[0].count;
    response.status(200).json({
      updated_at: updatedAt, // view
      dependencies: {
        database: {
          version: dataBaseVersionValue,
          max_connections: parseInt(dataBaseMaxConnectionsValue),
          open_connections: databaseOpennedConnectionsValue,
        },
      },
    });
  } catch (error) {
    console.log("\n Erro dentro do catch do controller: ");
    const publicErrorObject = new InternalServerError({ cause: error });
    console.error(publicErrorObject);
    response.status(500).json(publicErrorObject);
  }
}

export default status;
