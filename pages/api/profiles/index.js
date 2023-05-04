import { pool } from "config/db";
import jwt from "jsonwebtoken";


export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return await getProfiles(req, res);
    default:
      return res.status(400).send("Method not allowed");
  }
}

const getProfiles = async (req, res) => {
  try {
    const { myTokenName } = req.cookies;

    if (!myTokenName) {
      return res.status(401).json({ error: "Not logged in" });
    }

    const token = jwt.verify(myTokenName, "secret");

    const results = await pool.query("SELECT * FROM perfil");

    const profiles = {
      results,
      validate: token
    }
    return res.status(200).json(profiles);
  } catch (error) {
    return res.status(500).json({ error });
  }
};
