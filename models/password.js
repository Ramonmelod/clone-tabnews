import bcriptjs from "bcryptjs";

async function hash(password) {
  const rounds = getNumberOfRounds();
  return await bcriptjs.hash(password, rounds);
}

function getNumberOfRounds() {
  return process.env.NODE_ENV === "production" ? 14 : 1;
}
async function compare(providedPassword, StoredPassword) {
  return await bcriptjs.compare(providedPassword, StoredPassword);
}

const password = {
  hash,
  compare,
};

export default password;
