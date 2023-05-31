
import mysql from "serverless-mysql";

// const pool = mysql({
//   config: {
//     host: "localhost",
//     user: "root",
//     password: "",
//     port: 3306,
//     database: "imagenesdb",
//   },
// });
const pool = mysql({
  config: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
});

// const pool = mysql({
//   config: {
//     host: "www.powerfullperu.com",
//     user: "powerco_bd",
//     password: "P@ssw0rd123",
//     database: "powerco_imagenesdb",
//   },
// });

export { pool };