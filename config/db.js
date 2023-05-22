
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
    host: "www.powerfullperu.com",
    user: "powerco_bd",
    password: "P@ssw0rd123",
    database: "powerco_imagenesdb",
  },
});

export { pool };