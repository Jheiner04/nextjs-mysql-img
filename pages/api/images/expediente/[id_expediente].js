import { pool } from "config/db";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return await getImagesByExpediente(req, res);
    case "DELETE":
      return await deleteImageByExpediente(req, res);
    default:
      return res.status(400).json({ message: "bad request" });
  }
}

const getImagesByExpediente = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM imagen WHERE id_expediente_credito = ?", [
      req.query.id_expediente,
    ]);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteImageByExpediente = async (req, res) => {
  try {
    await pool.query("DELETE FROM imagen WHERE id_expediente_credito = ?", [req.query.id_expediente]);
    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
