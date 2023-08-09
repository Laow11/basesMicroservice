import { Router } from "express";
import multer from "multer";
import xlsx from "xlsx";
import fs from "fs";
import ExcelJS from "exceljs";
import path from "path";

const upload = multer({ dest: "uploads/" });
const router = Router();

router.post("/upload_bapro-cr", upload.single("file"), async (req, res) => {
  try {
    // Conversor de Excel a Json
    const readBook = xlsx.readFile(req.file.path);

    const sheetName = readBook.SheetNames[0];

    // Conversion a formato json
    const jsonData = xlsx.utils.sheet_to_json(readBook.Sheets[sheetName]);

    function obtenerSoloNumeros(cadena) {
      return cadena.replace(/\D/g, "");
    }

    const jsonToCsv = jsonData.map((datos) => {
      // ENT = ENTREGA, F = REENVÍO, R = RETIRO, C = CAMBIO.

      const codigoPostal = datos.CP.replace(/\D/g, "");

      return {
        tipo_operacion: datos.GESTION.includes("REENVIO")
          ? "F"
          : datos.GESTION.charAt(0),
        sector: "PAQUETERIA",
        cliente_id: "29",
        servicio_id: "8",
        codigo_sucursal: "SP836",
        "comprador.localidad": datos.LOCALIDAD,
        "datosEnvios.valor_declarado": null,
        "datosEnvios.confirmada": "1",
        trabajo: null,
        lote: null,
        remito: datos.REMITO,
        "sender.empresa": null,
        "sender.remitente": "AC EASTWAY SA (BAPRO)",
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
        "comprador.cp": codigoPostal,
        "comprador.email": datos.EMAIL,
        "comprador.other_info": datos.OBSERVACION,
        "comprador.horario": null,
        "comprador.obs1": null,
        "comprador.obs2": datos.SKU,
        "datosEnvios.bultos": datos.CANTIDAD,
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
    const writableStream = fs.createWriteStream("ACEASTWAYBAPRO_CR.csv");

    csvStream.pipe(writableStream);
    jsonToCsv.forEach((data) => csvStream.write(data));
    csvStream.end();

    writableStream.on("finish", () => {
      const file = path.resolve("ACEASTWAYBAPRO_CR.csv");
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
