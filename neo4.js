const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
  'bolt://52.207.211.130:7687', // Neo4j connection URL
  neo4j.auth.basic('neo4j', 'manuals-occasions-laces') // Neo4j authentication
);

const session = driver.session({database:"neo4j"});

module.exports = session;
