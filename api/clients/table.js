const { TableClient } = require("@azure/data-tables");

const client = TableClient.fromConnectionString(
  process.env.CONNECTION_STRING,
  "TABLE_NAME",
);

exports.tableClient = client;
