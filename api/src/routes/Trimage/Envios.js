import { Router } from "express";
import multer from "multer";
import xlsx from "xlsx";
import fs from "fs";
import ExcelJS from "exceljs";
import path from "path";

const upload = multer({ dest: "uploads/" });
const router = Router();

router.post("/upload_trimage", upload.single("file"), async (req, res) => {
  try {
    // Conversor de Excel a Json
    const readBook = xlsx.readFile(req.file.path);

    const sheetName = readBook.SheetNames[0];

    // Conversion a formato json
    const jsonData = xlsx.utils.sheet_to_json(readBook.Sheets[sheetName]);

    let loteCount = 1;

    const jsonToXlsx = jsonData.map((datos) => {
      // Envios OCASA, Macro
      return {
        tipo_operacion: "ENT",
        sector: "PAQUETERIA",
        cliente_id: "252",
        servicio_id: "23",
        codigo_sucursal: "SP1047",
        "comprador.localidad": "CABA",
        "datosEnvios.valor_declarado": null,
        "datosEnvios.confirmada": "1",
        trabajo: null,
        lote: loteCount++,
        remito: datos.REMITO,
        "sender.empresa": null,
        "sender.remitente": "TRIMAGE",
        "sender.calle": "ARCE 315 7 C",
        "sender.altura": null,
        "sender.localidad": "CIUDAD AUTONOMA DE BS AS",
        "sender.provincia": "CIUDAD AUTONOMA DE BS AS",
        "sender.cp": "1426",
        "comprador.apellido_nombre":
          datos.APELLIDO + " " + datos.NOMBRE
            ? datos.APELLIDO + " " + datos.NOMBRE
            : datos.NOMBREYAPELLIDO,
        "comprador.calle": "Av. 27 de Febrero",
        "comprador.altura": "6350",
        "comprador.piso": null,
        "comprador.dpto": null,
        "comprador.provincia": "CABA",
        "comprador.cp": "1437",
        "comprador.celular": null,
        "comprador.email": null,
        "comprador.other_info": null,
        "comprador.horario": null,
        "comprador.obs1": null,
        "comprador.obs2": datos.SKU,
        "datosEnvios.bultos": 1,
        "datosEnvios.peso": 1,
        "datosEnvios.alto": null,
        "datosEnvios.ancho": null,
        "datosEnvios.largo": null,
        "datosEnvios.observaciones": null,
        caja: null,
        "item.bulto": 1,
        "item.peso": 1,
        "item.alto": 0,
        "item.largo": 0,
        "item.profundidad": 0,
        "item.descripcion": datos.DESCRIPCION,
        "item.sku": datos.SKU,
      };
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    // Agregar encabezados
    const headers = Object.keys(jsonToXlsx[0]);
    worksheet.addRow(headers);

    // Agregar filas de datos
    jsonToXlsx.forEach((data) => {
      const values = headers.map((header) => data[header]);
      worksheet.addRow(values);
    });

    // Crear el archivo XLSX
    const xlsxFilePath = path.resolve("ARGENPROM_TRIMAGE.xlsx");
    workbook.xlsx.writeFile(xlsxFilePath).then(() => {
      // Descargar el archivo después de crearlo
      res.download(xlsxFilePath, (err) => {
        if (err) {
          console.error("Error al descargar el archivo:", err);
        } else {
          // Eliminar el archivo después de que se haya descargado con éxito
          fs.unlink(xlsxFilePath, (err) => {
            if (err) {
              console.error("Error al eliminar el archivo:", err);
            } else {
              console.log("Archivo eliminado:", xlsxFilePath);
            }
          });
        }
      });
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
    console.log(error);
  }
});

export default router;
