import { pool } from "config/db";
const bcrypt = require("bcrypt");

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return await getUser(req, res);
    case "DELETE":
      return await updateStateUser(req, res);
    case "PUT":
      return await updateUser(req, res);
    default:
      return res.status(400).json({ message: "bad request" });
  }
}

const getUser = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM usuario WHERE id_usuario = ?", [
      req.query.id,
    ]);
    return res.status(200).json(result[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateStateUser = async (req, res) => {
  try {
    // console.log("USER DELETE:", req.body.estado)
    await pool.query("UPDATE usuario SET ? WHERE id_usuario = ?", [
      req.body,
      req.query.id,
    ]);
    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id_perfil, nombre_completo, email, usuario, clave } = req.body;
    let paramUser = {}
    if (clave == '') {
      paramUser = { id_perfil, nombre_completo, email, usuario }
    } else {
      // Generar salt para la encriptación
      const salt = await bcrypt.genSalt(10);

      // Encriptar la clave utilizando el salt generado
      const hashedClave = await bcrypt.hash(clave, salt);
      paramUser = { id_perfil, nombre_completo, email, usuario, clave: hashedClave }
    }

    await pool.query("UPDATE usuario SET ? WHERE id_usuario = ?", [
      paramUser,
      req.query.id,
    ]);
    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
