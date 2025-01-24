import { Client } from "pg";

async function query(queryObject) {
  let client;

  try {
    client = await getNewClient();
    console.log("NODE_ENV: " + process.env.NODE_ENV);
    console.log("POSTEGRE_CA: " + process.env.POSTGRES_CA);
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.log("Erro no try-catch: " + error);
    throw error;
  } finally {
    await client.end();
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

export default {
  query, //query: query,
  getNewClient, //getNewClient: getNewClient,
};

function getSSLValues() {
  if (process.env.POSTGRES_CA) {
    return { ca: process.env.POSTGRES_CA };
  }

  return process.env.NODE_ENV === "production" ? true : false; // enables encryption of information being transmitted
}
