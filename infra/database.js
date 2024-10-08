import { Client } from "pg";

async function query(queryObject) {
  let client;

  try {
    client = await getNewClient();
    console.log(process.env.NODE_ENV);
    console.log("AQUI: " + process.env.POSTGRES_CA);
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
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: true, //getSSLValues(),
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
  return process.env.NODE_ENV === "development" ? false : true; // habilita a criptografia das informações trafegadas
}
