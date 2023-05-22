import { pool } from "config/db";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return await getExpediente(req, res);
    case "DELETE":
      return await deleteProduct(req, res);
    case "PUT":
      return await updateProduct(req, res);
    default:
      return res.status(400).json({ message: "bad request" });
  }
}

const getExpediente = async (req, res) => {
  try {
    const result = await pool.query("SELECT ec.id_expediente_credito, s.nombre_completo, s.dni, ec.fecha_hora_creacion FROM expediente_credito ec INNER JOIN socio s ON ec.id_socio = s.id_socio WHERE ec.id_expediente_credito = ?", [
      req.query.id,
    ]);
    return res.status(200).json(result[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await pool.query("DELETE FROM product WHERE id = ?", [req.query.id]);
    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    await pool.query("UPDATE product SET ? WHERE id = ?", [
      req.body,
      req.query.id,
    ]);
    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
