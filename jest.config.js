const nextJest = require("next/jest");

const createJestconfig = nextJest();
const jestConfig = createJestconfig({
  moduleDirectories: ["node_modules", "<rootDir>"], //marks the root directory
});
module.exports = jestConfig;
