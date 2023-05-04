import { pool } from "config/db";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return await getImage(req, res);
    case "POST":
      return await saveImage(req, res);
    default:
      return res.status(400).send("Method not allowed");
  }
}

const getImage = async (req, res) => {
  try {
    const results = await pool.query("SELECT * FROM imagen");
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const saveImage = async (req, res) => {
  try {
    const { name, description, price } = req.body;

    const result = await pool.query("INSERT INTO imagen SET ?", {
      name,
      description,
      price,
    });

    return res.status(200).json({ ...req.body, id: result.insertId });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
