import { pool } from "config/db";
const cors = require("cors");
const multer = require("multer");
const sharp = require("sharp");
const path = require('path');
import jwt from "jsonwebtoken";
// import multer from "multer";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return await getExpedientes(req, res);
    case "POST":
      return await saveExpediente(req, res);
    default:
      return res.status(400).send("Method not allowed");
  }
}

const getExpedientes = async (req, res) => {
  try {
    const { myTokenName } = req.cookies;

    if (!myTokenName) {
      return res.status(401).json({ error: "Not logged in" });
    }

    const token = jwt.verify(myTokenName, "secret");

    const results = await pool.query("SELECT ec.id_expediente_credito, s.nombre_completo, s.dni, ec.fecha_hora_creacion FROM expediente_credito ec INNER JOIN socio s ON ec.id_socio = s.id_socio WHERE id_usuario = ? ORDER BY 1", [token.id_usuario]);
    return res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const saveExpediente = async (req, res) => {

  try {

    // Middleware para verificar el tipo de contenido
    checkContentType(req, res, () => {
      // Configuración del almacenamiento y nombre del archivo
      const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, path.join(__dirname, "./")); // Directorio donde se almacenarán los archivos subidos
        },
        filename: function (req, file, cb) {
          cb(null, file.originalname); // Nombre original del archivo
        },
      });
      // Configuración de multer
      const upload = multer({ storage });

      // Definir el middleware de multer para el campo de entrada "imagen"
      upload.single("file")(req, res, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: '5J0: ' + err });
        }

        res.status(200).json({ message: "Formulario enviado correctamente." });
      });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};