const { exec } = require("node:child_process");

function checkPostgres() {
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn); //this local hosts makes the pg_isready to check the tcp/ip connection

  function handleReturn(erro, stdout) {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(".");
      checkPostgres();
      return;
    }
    console.log("\n🟢 Postgres está pronto e aceitando conexões!\n");
  }
}

process.stdout.write("\n \n🔴 aguardando postgres aceitar conexões \n");
checkPostgres();
