import { Router } from "express";
import multer from "multer";
import xlsx from "xlsx";
import fs from "fs";
import ExcelJS from "exceljs";
import path from "path";

const upload = multer({ dest: "uploads/" });
const router = Router();

router.post("/upload_itau-canje", upload.single("file"), async (req, res) => {
  try {
    // Conversor de Excel a Json
    const readBook = xlsx.readFile(req.file.path);

    const sheetName = readBook.SheetNames[0];

    // Conversion a formato json
    const jsonData = xlsx.utils.sheet_to_json(readBook.Sheets[sheetName]);

    console.log(jsonData[0]);

    const jsonToCsv = jsonData.map((datos) => {
      return {
        tipo_operacion: "ENT",
        sector: "PAQUETERIA",
        cliente_id: "139",
        servicio_id: "8",
        codigo_sucursal: "SP937",
        "comprador.localidad": datos.LOCALIDAD,
        "datosEnvios.valor_declarado": null,
        "datosEnvios.confirmada": "1",
        trabajo: null,
        remito: datos.REMITO,
        "sender.empresa": null,
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
        "comprador.celular": datos.TELEFONO,
        "comprador.other_info": datos.OBSERVACION,
        "comprador.email": datos.EMAIL,
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
    console.log(jsonToCsv);

    const csvStream = csv.format({ headers: true });
    const writableStream = fs.createWriteStream("ITAU_CANJE.csv");

    csvStream.pipe(writableStream);
    jsonToCsv.forEach((data) => csvStream.write(data));
    csvStream.end();

    const file = path.resolve("ITAU_CANJE.csv");
    res.download(file);
  } catch (error) {
    res.status(500).send({ error: error.message });
    console.log(error);
  }
});

export default router;
