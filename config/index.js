/* global process */

module.exports = (() => {
  const appEnv = process.env.APPENV === "prod" ? "prod" : "dev";
  return require(`./${appEnv}`);
})();
