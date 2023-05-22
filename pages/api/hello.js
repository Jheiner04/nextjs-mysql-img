// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { pool } from "config/db";

export default async function handler(req, res) {
  // Realizar consultas u operaciones con la conexión
  pool.query('SELECT NOW()', (error, results, fields) => {
    if (error) {
      console.error('Error al ejecutar la consulta HELLO:', error);
    } else {
      console.log('Resultados:', results);
      res.status(200).json({ result: results[0]["NOW()"] });
    }
  });

}
