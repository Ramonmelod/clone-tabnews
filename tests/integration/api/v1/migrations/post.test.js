test("test/integration/api/migrations/post.test.js response é 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  console.log(responseBody);
  expect(Array.isArray(responseBody)).toBe(true);
});
