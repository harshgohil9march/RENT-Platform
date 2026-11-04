
import mysql from 'mysql2/promise';
// We use 'mysql2/promise' instead of standard 'mysql' so we can use modern async/await syntax instead of older callback functions.
import dotenv from 'dotenv';

dotenv.config();

// Why a Pool instead of a standard connection? 
// If 100 users open your app at once, a standard connection would crash. A "Pool" keeps a set number (connectionLimit: 10) of database connections open at all times. When a user requests data, the pool hands them a temporary connection, and takes it back when they are done. It is highly efficient.
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection()
    .then((connection)=>{
        console.log(`Succesfully connected to MySQL database: ${process.env.DB_NAME} \n`);
        connection.release();
    })// When the app starts, we ask the pool for a single connection just to test if the credentials in our .env file are correct. Once it connects successfully, we release() it back into the pool.
    .catch((err)=>{
        console.log('Èrror produced while connecting the server to database: ', err);
    })

    export default pool;