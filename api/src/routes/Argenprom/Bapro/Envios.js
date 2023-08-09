import { Router } from "express";
import multer from "multer";
import xlsx from "xlsx";
import fs from "fs";
import csv from "fast-csv";
import path from "path";

const upload = multer({ dest: "uploads/" });
const router = Router();

router.post(
  "/upload_bapro-argenprom",
  upload.single("file"),
  async (req, res) => {
    try {
      // Conversor de Excel a Json
      const readBook = xlsx.readFile(req.file.path);

      const sheetName = readBook.SheetNames[0];

      // Conversion a formato json
      const jsonData = xlsx.utils.sheet_to_json(readBook.Sheets[sheetName]);

      const jsonToCsv = jsonData.map((datos) => {
        // Envios OCASA, Macro
        const codigoPostal = datos.CP.toString().replace(/\D/g, "");
        return {
          tipo_operacion: "ENT",
          sector: "PAQUETERIA",
          cliente_id: "41", // CAMBIAR
          servicio_id: "8", // CAMBIAR
          codigo_sucursal: "SP665", // CAMBIAR
          "comprador.localidad": datos.LOCALIDAD,
          "datosEnvios.valor_declarado": null,
          "datosEnvios.confirmada": "1",
          trabajo: null,
          lote: null,
          remito: datos.REMITO,
          "sender.empresa": null,
          "sender.remitente": "ARGENPROM (BAPRO)",
          "sender.calle": "MARTINEZ LEZICA",
          "sender.altura": "3046",
          "sender.localidad": "CIUDAD AUTONOMA DE BS AS",
          "sender.provincia": "BUENOS AIRES",
          "sender.cp": "1426",
          "comprador.apellido_nombre": datos.NOMBREYAPELLIDO
            ? datos.NOMBREYAPELLIDO
            : datos.APELLIDO + datos.NOMBRE,
          "comprador.calle": datos.CALLE,
          "comprador.altura": null,
          "comprador.piso": null,
          "comprador.dpto": null,
          "comprador.provincia": datos.PROVINCIA,
          "comprador.cp": codigoPostal,
          "comprador.celular": datos.TELEFONO,
          "comprador.email": datos.EMAIL,
          "comprador.other_info": null,
          "comprador.horario": null,
          "comprador.obs1": null,
          "comprador.obs2": datos.SKU,
          "datosEnvios.bultos": "1",
          "datosEnvios.peso": null,
          "datosEnvios.alto": null,
          "datosEnvios.ancho": null,
          "datosEnvios.largo": null,
          caja: null,
          "item.bulto": "1",
          "item.peso": 0,
          "item.alto": 0,
          "item.largo": 0,
          "item.profundidad": 0,
          "item.sku": datos.SKU,
        };
      });

      console.log(jsonToCsv);

      const csvStream = csv.format({ headers: true });
      const writableStream = fs.createWriteStream("ARGENPROM_BAPRO.csv");

      csvStream.pipe(writableStream);
      jsonToCsv.forEach((data) => csvStream.write(data));
      csvStream.end();

      writableStream.on("finish", () => {
        const file = path.resolve("ARGENPROM_BAPRO.csv");
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
      console.log(error);
    }
  }
);

export default router;
