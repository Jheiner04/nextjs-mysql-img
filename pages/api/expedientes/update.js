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
      const imagesLoaded = JSON.parse(req.body.imagesLoaded);
      const keysImages = Object.keys(imagesLoaded);
      const { id_expediente } = req.body
      const id_expediente_credito = parseInt(id_expediente, 10);

      if (isNaN(id_expediente_credito)) return res.status(404).json({ error: "Expediente no válido" });

      //Eliminar imágenes actuales
      try {
        const resultDelete = await pool.query("DELETE FROM imagen WHERE id_expediente_credito = ?", [id_expediente_credito]);
        if (resultDelete.affectedRows === 0) return res.status(404).json({ error: "No se encontró expediente" });
      } catch (error) {
        console.log("Ocurrió un error al ejecutar la sentencia Expediente SQL:", error);
      }
      //Guardar imágenes que ya estaban cargadas
      if (keysImages.length > 0) {

        try {
          for (let i = 0; i < keysImages.length; i++) {
            let clave = keysImages[i];

            const [, nombre] = imagesLoaded[clave].split('-name-');
            const [, url] = imagesLoaded[clave].split('uploads/');
            await pool.query("INSERT INTO imagen SET ?", {
              nombre: nombre,
              url: url,
              descripcion: req.body.description[clave],
              id_expediente_credito: id_expediente_credito
            });
          }
        } catch (error) {
          console.log("Ocurrió un error al ejecutar la sentencia Imagen SQL:", error);
        }
      }
      //Guardar nuevas imágenes
      req.files.map(async (file) => {
        let uuid = file.fieldname;
        try {
          const resultImage = await pool.query("INSERT INTO imagen SET ?", {
            nombre: file.originalname,
            url: `${file.filename}`,
            descripcion: req.body.description[`${uuid}`],
            id_expediente_credito: id_expediente_credito
          });
          if (resultImage.affectedRows === 0) return res.status(500).json({ error: "Error al guardar imagen." });

          if (file.size > 2097152) {
            await helperImg(file, `resize-${file.fieldname}-name-${file.originalname}`, 600);
          }
        } catch (error) {
          console.log("Ocurrió un error al ejecutar la sentencia Imagen SQL insert:", error);
        }
      });

      return res.status(200).json({ id: id_expediente_credito });

    }
  });

}
