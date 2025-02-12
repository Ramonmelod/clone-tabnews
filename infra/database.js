import { Client } from "pg";
import { ServiceError } from "./errors.js";

async function query(queryObject) {
  let client;

  try {
    client = await getNewClient();
    console.log("NODE_ENV: " + process.env.NODE_ENV);
    console.log("POSTEGRE_CA: " + process.env.POSTGRES_CA);
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    const serviceErrorObject = new ServiceError({
      cause: error,
      message: "Erro na conexão com o Banco de dados ou na Query",
    });
    throw serviceErrorObject;
  } finally {
    await client?.end(); //the ? makes the client.end be called only if client is no undefined
  }
}

async function getNewClient() {
  console.log("getSSLValues: " + getSSLValues());
  console.log("POSTGRES_CA: " + process.env.POSTGRES_CA);

  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
  });

  await client.connect();
  return client;
}

const database = {
  query, //query: query,
  getNewClient, //getNewClient: getNewClient,
};

export default database;

function getSSLValues() {
  if (process.env.POSTGRES_CA) {
    return { ca: process.env.POSTGRES_CA };
  }

  return process.env.NODE_ENV === "production" ? true : false; // enables encryption of information being transmitted
}
