const { Client } = require("@opensearch-project/opensearch");

// finegrainer access control access policy
module.exports.client = new Client({
  node: process.env.SERVICE_URI,
  auth: {
    username: process.env.SERVICE_USERNAME,
    password: process.env.SERVICE_PASSWORD,
  },
  headers: {
    "Content-Type": "application/json",
  },
});
// Changed to your index name
module.exports.indexName = "talent_sourcing_v3";
