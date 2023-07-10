import { sign } from "jsonwebtoken";
import { serialize } from "cookie";
import { pool } from "config/db";
import { setCorsHeaders } from 'config/cors';
const bcrypt = require("bcrypt");

export default async function loginHandler(req, res) {
  setCorsHeaders(req, res);
  try {
    const { user, password } = req.body;
    // Buscar el usuario en la base de datos
    const results = await pool.query(
      "SELECT * FROM usuario WHERE usuario = ? AND estado = ?",
      [user, 1]
    );

    if (results.length === 0) {
      return res.status(401).json({ error: "Acceso denegado" });
    }

    const hashedClave = results[0].clave;

    // Comparar la contraseña ingresada con la contraseña encriptada del usuario
    const passwordsMatch = await bcrypt.compare(password, hashedClave);

    if (!passwordsMatch) {
      return res.status(401).json({ error: "¡Acceso denegado!" });
    }

    // Generar token de sesión
    const token = sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 2,
        user,
        username: results[0].nombre_completo,
        id_perfil: results[0].id_perfil,
        id_usuario: results[0].id_usuario,
      },
      "secret"
    );

    // Crear cookie de sesión
    const serialized = serialize("myTokenName", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 2,
      path: "/",
    });

    res.setHeader("Set-Cookie", serialized);
    return res.status(200).json({
      message: "Login successful",
    });
  } catch (error) {
    console.log('Error Login:', error);
    return res.status(500).json({ error: "Error al iniciar sesión" });

  }
}

