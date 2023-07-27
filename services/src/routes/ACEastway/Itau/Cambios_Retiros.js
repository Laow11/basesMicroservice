import { Router } from "express";
import multer from "multer";
import xlsx from "xlsx";
import fs from "fs";
import csv from "fast-csv";
import path from "path";

const upload = multer({ dest: "uploads/" });
const router = Router();

router.post("/upload_itau-cr", upload.single("file"), async (req, res) => {
  try {
    // Conversor de Excel a Json
    const readBook = xlsx.readFile(req.file.path);

    const sheetName = readBook.SheetNames[0];

    // Conversion a formato json
    const jsonData = xlsx.utils.sheet_to_json(readBook.Sheets[sheetName]);

    console.log(jsonData[0]);

    const jsonToCsv = jsonData.map((datos) => {
      // ENT = ENTREGA, F = REENVÍO, R = RETIRO, C = CAMBIO.
      return {
        tipo_operacion: datos.GESTION.includes("REENVIO")
          ? "F"
          : datos.GESTION.charAt(0),
        sector: "PAQUETERIA",
        cliente_id: "139",
        servicio_id: "8",
        codigo_sucursal: "SP937",
        "comprador.localidad": datos.LOCALIDAD,
        "datosEnvios.confirmada": "1",
        remito: datos.REMITO,
        "sender.remitente": "AC EASTWAY SA (ITAU)",
        "sender.calle": "GRAL MANSILLA",
        "sender.altura": "3603",
        "sender.provincia": "BUENOS AIRES",
        "sender.cp": "1426",
        "comprador.apellido_nombre": datos.NOMBREYAPELLIDO,
        "comprador.calle": datos.CALLE,
        "comprador.altura": datos.ALTURA,
        "comprador.piso": datos.PISO,
        "comprador.dpto": datos.DPTO,
        "comprador.provincia": datos.PROVINCIA,
        "comprador.cp": datos.CP,
        "comprador.other_info": datos.OBSERVACION,
        "comprador.email": datos.EMAIL,
        "comprador.obs2": datos.SKU,
        "datosEnvios.bultos": datos.CANTIDAD,
      };
    });
    console.log(jsonToCsv);

    const csvStream = csv.format({ headers: true });
    const writableStream = fs.createWriteStream("ITAU_CR.csv");

    csvStream.pipe(writableStream);
    jsonToCsv.forEach((data) => csvStream.write(data));
    csvStream.end();

    const file = path.resolve("ITAU_CR.csv");
    res.download(file);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

export default router;
