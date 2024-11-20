const { Pool } = require('pg');
require("dotenv").config();



// Replace these values with your PostgreSQL credentials
const connection = new Pool({
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    max: 10, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection cannot be established
});

// Sample query to verify the connection
connection.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('Error executing query', err.stack);
    } else {
      console.log('Current time in PostgreSQL:', res.rows[0]);
    }
    // No need to call connection.end() here
  });
module.exports = connection;
