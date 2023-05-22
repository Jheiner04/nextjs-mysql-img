import { pool } from "config/db";
import jwt from "jsonwebtoken";
const bcrypt = require("bcrypt");

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return await getUsers(req, res);
    case "POST":
      return await saveUser(req, res);
    default:
      return res.status(400).send("Method not allowed");
  }
}

const getUsers = async (req, res) => {
  try {
    const { myTokenName } = req.cookies;

    if (!myTokenName) {
      return res.status(401).json({ error: "Not logged in" });
    }
    const token = jwt.verify(myTokenName, "secret");
    const results = await pool.query("SELECT u.*, p.tipo_perfil FROM `usuario` u INNER JOIN perfil p on u.id_perfil = p.id_perfil");

    const users = {
      results,
      validate: token
    }
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const saveUser = async (req, res) => {
  try {
    const { id_perfil, nombre_completo, email, usuario, clave } = req.body;
    // Generar salt para la encriptación
    const salt = await bcrypt.genSalt(10);

    // Encriptar la clave utilizando el salt generado
    const hashedClave = await bcrypt.hash(clave, salt);

    const result = await pool.query("INSERT INTO usuario SET ?", {
      nombre_completo,
      usuario,
      clave: hashedClave,
      email,
      id_perfil,

    });

    return res.status(200).json({ ...req.body, id: result.insertId });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
