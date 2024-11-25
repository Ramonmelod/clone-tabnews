import retry from "async-retry";

async function waitForAllServices() {
  await waitForWebServer();
  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
    }); // the retry module calls the function until it get no error

    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");
      const responseBody = await response.json();
    }
  }
}

export default {
  waitForAllServices,
};
