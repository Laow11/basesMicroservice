import { Router } from "express";
import multer from "multer";
import xlsx from "xlsx";
import fs from "fs";
import ExcelJS from "exceljs";
import path from "path";

const upload = multer({ dest: "uploads/" });
const router = Router();

router.post("/upload_Peppers", upload.single("file"), async (req, res) => {
  try {
    // Conversor de Excel a Json
    const readBook = xlsx.readFile(req.file.path);

    const sheetName = readBook.SheetNames[0];

    // Conversion a formato json
    const jsonData = xlsx.utils.sheet_to_json(readBook.Sheets[sheetName]);

    let loteCount = 1;

    const jsonToXlsx = jsonData.map((datos) => {
      // Envios OCASA, Macro
      const codigoPostal = datos.CP.toString().replace(/\D/g, "");

      return {
        tipo_operacion: "ENT",
        sector: "PAQUETERIA",
        cliente_id: "50",
        servicio_id: "8",
        codigo_sucursal: "SP857",
        "comprador.localidad": datos.LOCALIDAD,
        "datosEnvios.valor_declarado": null,
        "datosEnvios.confirmada": "1",
        trabajo: null,
        lote: loteCount++,
        remito: datos.REMITO,
        "sender.empresa": null,
        "sender.remitente": "PEPPERS",
        "sender.calle": "JURAMENTO",
        "sender.altura": "2059",
        "sender.localidad": "CABA",
        "sender.provincia": "CABA",
        "sender.cp": "1428",
        "comprador.apellido_nombre": datos.NOMBREYAPELLIDO
          ? datos.NOMBREYAPELLIDO
          : datos.APELLIDO + " " + datos.NOMBRE,
        "comprador.calle": datos.CALLE,
        "comprador.altura": null,
        "comprador.piso": null,
        "comprador.dpto": null,
        "comprador.provincia": datos.PROVINCIA,
        "comprador.cp": codigoPostal,
        "comprador.celular": datos.TELEFONO,
        "comprador.email": datos.EMAIL,
        "comprador.other_info": datos.OBSERVACION,
        "comprador.horario": null,
        "comprador.obs1": null,
        "comprador.obs2": datos.SKU,
        "datosEnvios.bultos": "1",
        "datosEnvios.peso": datos.FECHA,
        "datosEnvios.alto": null,
        "datosEnvios.ancho": null,
        "datosEnvios.largo": null,
        "datosEnvios.observaciones": null,
        "comprador.documento": datos.DOCUMENTO,
        caja: null,
        "item.bulto": "1",
        "item.peso": 0,
        "item.alto": 0,
        "item.largo": 0,
        "item.profundidad": 0,
        "ite.descripcion": null,
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
    const xlsxFilePath = path.resolve("PEPPERS.xlsx");
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
