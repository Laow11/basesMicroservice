import { Router } from "express";
import multer from "multer";
import xlsx from "xlsx";
import fs from "fs";
import csv from "fast-csv";
import path from "path";

const upload = multer({ dest: "uploads/" });
const router = Router();

router.post("/upload_ciudad-cr", upload.single("file"), async (req, res) => {
  try {
    // Conversor de Excel a Json
    const readBook = xlsx.readFile(req.file.path);

    const sheetName = readBook.SheetNames[0];

    // Conversion a formato json
    const jsonData = xlsx.utils.sheet_to_json(readBook.Sheets[sheetName]);

    const jsonToCsv = jsonData.map((datos) => {
      // ENT = ENTREGA, F = REENVÍO, R = RETIRO, C = CAMBIO.

      return {
        tipo_operacion:
          datos.GESTION.includes("REENVIO") || datos.GESTION.includes("Reenvio")
            ? "F"
            : datos.GESTION.charAt(0),
        sector: "PAQUETERIA",
        cliente_id: "38",
        servicio_id: "8",
        codigo_sucursal: "SP704",
        "comprador.localidad": datos.LOCALIDAD,
        "datosEnvios.valor_declarado": null,
        "datosEnvios.confirmada": "1",
        trabajo: null,
        remito: datos.REMITO,
        "sender.empresa": null,
        "sender.remitente": "ARGENPROM (CIUDAD)",
        "sender.calle": "MARTIN LEZICA",
        "sender.altura": "3046",
        "sender.localidad": "MARTINEZ",
        "sender.provincia": "BUENOS AIRES",
        "sender.cp": "1640",
        "comprador.apellido_nombre": datos.NOMBREYAPELLIDO,
        "comprador.calle": datos.CALLE,
        "comprador.altura": datos.ALTURA,
        "comprador.piso": datos.PISO,
        "comprador.dpto": datos.DEPTO,
        "comprador.provincia": datos.PROVINCIA,
        "comprador.cp": datos.CP,
        "comprador.telefono": datos.TELEFONO,
        "comprador.other_info": null,
        "comprador.email": datos.EMAIL,
        "comprador.obs2": datos.SKU,
        "datosEnvios.bultos": datos.CANTIDAD,
      };
    });

    const csvStream = csv.format({ headers: true });
    const writableStream = fs.createWriteStream("ARGENPROM_CIUDAD_CR.csv");

    csvStream.pipe(writableStream);
    jsonToCsv.forEach((data) => csvStream.write(data));
    csvStream.end();
    console.log(jsonToCsv);

    writableStream.on("finish", () => {
      const file = path.resolve("ARGENPROM_CIUDAD_CR.csv");
      res.download(file, (err) => {
        if (err) {
          console.error("Error al descargar el archivo:", err);
        } else {
          // Eliminar el archivo después de que se haya descargado con éxito
          fs.unlink(file, (err) => {
            if (err) {
              console.error("Error al eliminar el archivo:", err);
            } else {
              console.log("Archivo eliminado:", file);
            }
          });
        }
      });
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

export default router;
