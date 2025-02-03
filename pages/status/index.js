import useSWR from "swr";

async function FetchApi(key) {
  // key value comes from useSWR
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <h1>Database</h1>
      <DatabaseInformations />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", FetchApi, {
    // key: /api/v1/status
    refreshInterval: 2000, // makes the swr updates the requisition to update the object
    //dedupingInterval: 2000, //controls the time between the requisitions, for it has a chache memory
  });

  let updatedAtText = " Carregando ...";
  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }
  return <div>Última atualização:{updatedAtText} </div>;
}

function DatabaseInformations() {
  const { isLoading, data } = useSWR("/api/v1/status", FetchApi, {
    // key: /api/v1/status
    refreshInterval: 2000, // makes the swr updates the requisition to update the object
    //dedupingInterval: 2000, //controls the time between the requisitions, for it has a chache memory
  });

  let dataBaseVersion = " Carregando ...";
  let dataBaseInMaxConnections = " Carregando ...";
  let dataBaseOpenConnections = " Carregando ...";

  if (!isLoading && data) {
    (dataBaseVersion = data.dependencies.database.version),
      (dataBaseInMaxConnections = data.dependencies.database.max_connections);
    dataBaseOpenConnections = data.dependencies.database.open_connections;
  }
  return (
    <>
      <div> Postgresql Version: {dataBaseVersion} </div>
      <div>Max number of connections: {dataBaseInMaxConnections}</div>
      <div>Open connections: {dataBaseOpenConnections}</div>
    </>
  );
}
