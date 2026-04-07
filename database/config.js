const mysql = require('mysql2/promise')

const pool = mysql.createPool(
    {
        host:process.env.HOST,
        user: process.env.USER,
        password:process.env.PASSWORD,
        database:  process.env.DATABASE,
        waitForConnections: true,
        connectionLimit: 10, 
        queueLimit: 0
    }
)

// const connection = async ()=>
// {
//     try 
//     {
//         const conn = await mysql.createConnection({
//             host:process.env.HOST,
//             user: process.env.USER,
//             password:process.env.PASSWORD,
//             database:  process.env.DATABASE,
//         })

//         console.log(`${conn.config.database} database is connected!`);
        
//     } 
//     catch (error) 
//     {
//         console.log(error);
        
//     }
// }

module.exports = pool