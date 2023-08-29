import { Router } from "express";
import multer from "multer";
import xlsx from "xlsx";
import fs from "fs";
import ExcelJS from "exceljs";
import path from "path";

const upload = multer({ dest: "uploads/" });
const router = Router();

router.post(
  "/upload_quilmes_multi",
  upload.single("file"),
  async (req, res) => {
    try {
      // Conversor de Excel a Json
      const readBook = xlsx.readFile(req.file.path);

      const sheetName = readBook.SheetNames[0];

      // Conversion a formato json
      const jsonData = xlsx.utils.sheet_to_json(readBook.Sheets[sheetName]);

      const jsonToXlsx = jsonData.map((datos) => {
        // Agregar logica que sume tanto el precio como el peso de los productos si son multi item o los duplique si el bulto es mayor a 1 (Si el bulto es mayor a 1, quiere decir que tiene mas de 1 producto iguales).
        return {
          referencia_retiro: datos.ORDEN, // Similar al lote, enumera los clientes.
          tipo_operacion: "ENT",
          sector: "PAQUETERIA",
          cliente_id: "256",
          servicio_id: "8",
          codigo_sucursal: "SP1051",
          "comprador.localidad": datos.LOCALIDAD,
          "datosEnvios.valor_declarado": null,
          "datosEnvios.confirmada": "1",
          trabajo: null,
          remito: datos.REMITO,
          "sender.empresa": null,
          "sender.remitente": "AC EASTWAY MARKETPLACE CORP",
          "sender.calle": "GRAL MANSILLA",
          "sender.altura": "3603",
          "sender.localidad": "CIUDAD AUTONOMA DE BS AS",
          "sender.provincia": "BUENOS AIRES",
          "sender.cp": "1426",
          "comprador.apellido_nombre":
            datos.APELLIDO + " " + datos.NOMBRE
              ? datos.APELLIDO + " " + datos.NOMBRE
              : datos.NOMBREYAPELLIDO,
          "comprador.calle": datos.CALLE,
          "comprador.altura": null,
          "comprador.piso": null,
          "comprador.dpto": null,
          "comprador.provincia": datos.PROVINCIA,
          "comprador.cp": datos.CP,
          "comprador.celular": datos.TELEFONO,
          "comprador.email": datos.EMAIL,
          "comprador.other_info": null,
          "comprador.obs1": null,
          "comprador.obs2": datos.SKU,
          "comprador.obs4": null,
          "datosEnvios.bultos": datos.BULTO,
          "datosEnvios.peso": null, // Aca va el peso final, despues de sumar todos los productos
          "datosEnvios.observaciones": null,
          "comprador.fecha_servicio": null,
          "comprador.hora_desde": null,
          "comprador.hora_hasta": null,
          "comprador.documento": datos.DNI,
          caja: null,
          "item.bulto": datos.BULTO,
          "item.peso": datos.AFORO, // Peso individualmente de cada producto
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
      const xlsxFilePath = path.resolve("ACEastway_QUILMES_MULTI_ITEM.xlsx");
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
  }
);

export default router;
