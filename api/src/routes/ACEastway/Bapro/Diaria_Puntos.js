import { Router } from "express";
import multer from "multer";
import xlsx from "xlsx";
import fs from "fs";
import ExcelJS from "exceljs";
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

    const jsonToXlsx = jsonData.map((datos) => {
      const codigoPostal = datos.CP.replace(/\D/g, "");

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
        "comprador.calle": datos.ALTURA,
        "comprador.altura": null,
        "comprador.piso": datos.PISO,
        "comprador.dpto": datos.DPTO,
        "comprador.provincia": datos.PROVINCIA,
        "comprador.cp": codigoPostal,
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
    const xlsxFilePath = path.resolve("ACEASTWAY_BAPRO.xlsx");
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
