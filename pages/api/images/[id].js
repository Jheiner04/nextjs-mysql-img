import { pool } from "config/db";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return await getImage(req, res);
    case "DELETE":
      return await deleteImage(req, res);
    case "PUT":
      return await updateImage(req, res);
    default:
      return res.status(400).json({ message: "bad request" });
  }
}

const getImage = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM imagen WHERE id = ?", [
      req.query.id,
    ]);
    return res.status(200).json(result[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteImage = async (req, res) => {
  try {
    await pool.query("DELETE FROM imagen WHERE id = ?", [req.query.id]);
    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateImage = async (req, res) => {
  try {
    await pool.query("UPDATE imagen SET ? WHERE id = ?", [
      req.body,
      req.query.id,
    ]);
    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
