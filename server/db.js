const { Pool } = require('pg');

const db = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'Alirezaw@17_sql',
  database: 'dbproject',
  port: 5432
});

module.exports = db; 

/* pool A Pool is recommended over a single Client — it manages multiple
connections automatically, which is better for a web server.*/