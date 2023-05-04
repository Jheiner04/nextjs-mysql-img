import { pool } from "config/db";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return await getSocios(req, res);
    case "POST":
      return await saveSocio(req, res);
    default:
      return res.status(400).send("Method not allowed");
  }
}

const getSocios = async (req, res) => {
  try {
    const results = await pool.query("SELECT ec.id_expediente_credito, s.nombre_completo, s.dni, ec.fecha_hora_creacion FROM expediente_credito ec INNER JOIN socio s ON ec.id_socio = s.id_socio WHERE id_usuario = ?", [1]);
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const saveSocio = async (req, res) => {
  try {
    const { dni, nombre_completo } = req.body;

    const result = await pool.query("INSERT INTO socio SET ?", {
      dni,
      nombre_completo,
    });
    return res.status(200).json({ ...req.body, id: result.insertId });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
