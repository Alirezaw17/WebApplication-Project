require('dotenv').config();
const { Pool } = require('pg');

const db = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

module.exports = db;

/* pool A Pool is recommended over a single Client — it manages multiple
connections automatically, which is better for a web server.*/

/*Your password is hardcoded and visible — if you push to GitHub, it's exposed!
so i changed my db to use .env and created .env file in my server and i should add this 
file to the .gitignore file so it does not expose my pass.*/

/* JWT_SECRET=your_super_secret_key -> mySecretHere
  It's just a random string you make up yourself — it's used to sign and
   verify JWT tokens. The longer and more random */


  