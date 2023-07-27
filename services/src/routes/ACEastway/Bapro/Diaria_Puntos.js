import { Router } from "express";
import multer from "multer";
import xlsx from "xlsx";
import fs from "fs";
import csv from "fast-csv";
import path from "path";

const upload = multer({ dest: "uploads/" });
const router = Router();

router.post("/upload_bapro-canje", upload.single("file"), async (req, res) => {
  try {
    // Conversor de Excel a Json
    const readBook = xlsx.readFile(req.file.path);

    const sheetName = readBook.SheetNames[0];

    // Conversion a formato json
    const jsonData = xlsx.utils.sheet_to_json(readBook.Sheets[sheetName]);

    const jsonToCsv = jsonData.map((datos) => {
      return {
        tipo_operacion: "ENT",
        sector: "PAQUETERIA",
        cliente_id: "29",
        servicio_id: "8",
        codigo_sucursal: "SP836",
        "comprador.localidad": datos.LOCALIDAD,
        "datosEnvios.valor_declarado": null,
        "datosEnvios.confirmada": "1",
        trabajo: null,
        remito: datos.REMITO,
        "sender.empresa": null,
        "sender.remitente": "AC EASTWAY (BAPRO)",
        "sender.calle": "GRAL MANSILLA",
        "sender.altura": "3603",
        "sender.localidad": "CIUDAD AUTONOMA DE BS AS",
        "sender.provincia": "BUENOS AIRES",
        "sender.cp": "1426",
        "comprador.apellido_nombre": datos.APELLIDO + " " + datos.NOMBRE,
        "comprador.calle": datos.CALLE,
        "comprador.altura": datos.ALTURA,
        "comprador.piso": datos.PISO,
        "comprador.dpto": datos.DPTO,
        "comprador.provincia": datos.PROVINCIA,
        "comprador.cp": datos.CP,
        "comprador.celular": datos.TELEFONO,
        "comprador.email": datos.EMAIL,
        "comprador.other_info": datos.OBSERVACION,
        "comprador.horario": null,
        "comprador.obs1": null,
        "comprador.obs2": datos.SKU,
        "datosEnvios.bultos": "1",
        "datosEnvios.peso": null,
        "datosEnvios.alto": null,
        "datosEnvios.ancho": null,
        "datosEnvios.largo": null,
        "comprador.documento": datos.DOCUMENTO,
        caja: null,
        "item.bulto": "1",
        "item.peso": 0,
        "item.alto": 0,
        "item.largo": 0,
        "item.profundidad": 0,
        "item.descripcion": null,
        "item.sku": datos.SKU,
      };
    });

    const csvStream = csv.format({ headers: true });
    const writableStream = fs.createWriteStream("ACEASTWAYBAPRO_CANJES.csv", {
      encoding: "utf-8",
    });

    csvStream.pipe(writableStream);
    jsonToCsv.forEach((data) => csvStream.write(data));
    csvStream.end();

    const file = path.resolve("ACEASTWAYBAPRO_CANJES.csv");
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=ACEASTWAYBAPRO_CANJES.csv"
    );

    res.sendFile(file, { encoding: "utf-8" });
  } catch (error) {
    res.status(500).send({ error: error.message });
    console.log(error);
  }
});

export default router;
