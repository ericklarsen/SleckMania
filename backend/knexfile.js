const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  development: {
    client: "postgresql",
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: "./db/migrations",
    },
    seeds: {
      directory: "./db/seeds",
    },
    useNullAsDefault: true,
  },
};
