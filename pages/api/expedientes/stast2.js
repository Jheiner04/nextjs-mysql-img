import { pool } from "config/db";
import multer from "multer";
import path from "path";
const sharp = require("sharp");
const fs = require('fs');
import jwt from "jsonwebtoken";

// Configuración del almacenamiento y nombre del archivo
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `resize-${file.fieldname}-name-${file.originalname}`);
  },
});

const upload = multer({ storage });

export const config = {
  api: {
    bodyParser: false,
  },
};

// const helperImg = async (file, fileName, size = 300) => {
//   const filePath = path.join(file.destination, file.filename);
//   const resizedImage = await sharp(filePath).resize(size).toBuffer();
//   await fs.promises.writeFile(`./public/uploads/${fileName}`, resizedImage);
// };
// versión v3
const helperImg = async (file, fileName, maxHeight = 300) => {
  const filePath = path.join(file.destination, file.filename);
  const metadata = await sharp(filePath).metadata();

  // Verificar si la imagen supera la altura máxima especificada
  if (metadata.height > maxHeight) {
    const aspectRatio = metadata.width / metadata.height;
    const newWidth = Math.round(maxHeight * aspectRatio);

    const resizedImage = await sharp(filePath).resize({ height: 1000 }).rotate().toBuffer();

    await fs.promises.writeFile(`./public/uploads/${fileName}`, resizedImage);
  } else {
    // Si la imagen no supera la altura máxima, guardarla sin cambios
    const resizedImage = await sharp(filePath).resize(maxHeight).rotate().toBuffer(); // Aplica la orientación original en la imagen redimensionada
    await fs.promises.writeFile(`./public/uploads/${fileName}`, resizedImage);
  }
};


export default function handler(req, res) {
  console.log("REQ:", req.cookies)
  upload.any()(req, res, async (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al subir el archivo." });
    } else {
      //Guardar expediente
      const { myTokenName } = req.cookies;

      if (!myTokenName) {
        return res.status(401).json({ error: "Not logged in" });
      }

      const token = jwt.verify(myTokenName, "secret");

      const { id_socio } = req.body;
      const id_usuario = token.id_usuario;

      const result = await pool.query("INSERT INTO expediente_credito SET ?", {
        id_usuario,
        id_socio,
      });
      let id_expediente_credito = result.insertId ? result.insertId : -1;
      if (id_expediente_credito === -1) return res.status(500).json({ error: "Error al guardar expediente." });
      // return res.status(200).json({ ...req.body, id: result.insertId });

      req.files.map(async (file) => {
        let uuid = file.fieldname;
        const resultImage = await pool.query("INSERT INTO imagen SET ?", {
          nombre: file.originalname,
          url: `${file.filename}`,
          descripcion: req.body.description[`${uuid}`],
          id_expediente_credito: id_expediente_credito
        });
        //ToDo: primero verificar que el tamaño de la imagen sea menor o igual a 2 Megas, se guarda normal, de lo contrario, se comprime
        if (file.size > 200000) {
          // if (file.size > 2097152) {
          // await helperImg(file.path, `${file.filename}`, 600)
          await helperImg(file, `resize-${file.fieldname}-name-${file.originalname}`, 600);
        }

      }

      );
      return res.status(200).json({ ...req.body, id: result.insertId });
    }
  });
}
