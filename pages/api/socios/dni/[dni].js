import { pool } from "config/db";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return await getSocio(req, res);
    case "DELETE":
      return await deleteSocio(req, res);
    case "PUT":
      return await updateSocio(req, res);
    default:
      return res.status(400).json({ message: "bad request" });
  }
}

const getSocio = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM socio WHERE dni = ? limit 1", [
      req.query.dni,
    ]);
    return res.status(200).json(result[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteSocio = async (req, res) => {
  try {
    await pool.query("DELETE FROM product WHERE id = ?", [req.query.id]);
    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateSocio = async (req, res) => {
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
