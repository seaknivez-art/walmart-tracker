const fs = require("fs");
const XLSX = require("xlsx");

// ===== CONFIGURACIÓN =====
const sucursales = Array.from({ length: 50 }, (_, i) => `Sucursal ${i+1} EdoMex`);
const departamentos = ["Abarrotes", "Electrónica", "Ropa"];

// ===== GENERAR DATOS =====
function generarDatos() {
  let rows = [];

  departamentos.forEach(dep => {
    sucursales.forEach(suc => {
      for (let i = 0; i < 5; i++) {

        const precioAnterior = Math.floor(Math.random() * 100);
        const precioNuevo = Math.floor(Math.random() * 100);

        rows.push({
          Fecha: new Date().toISOString().split("T")[0],
          Departamento: dep,
          Sucursal: suc,
          Producto: "Producto " + Math.floor(Math.random() * 1000),
          Precio_Anterior: precioAnterior,
          Precio_Nuevo: precioNuevo,
          Stock: Math.floor(Math.random() * 200)
        });

      }
    });
  });

  return rows;
}

// ===== EJECUCIÓN =====
const data = generarDatos();
const fecha = new Date().toISOString().split("T")[0];

// Crear carpeta si no existe
fs.mkdirSync("data", { recursive: true });

// Guardar JSON
fs.writeFileSync(`data/${fecha}.json`, JSON.stringify(data, null, 2));

// Crear Excel
const workbook = XLSX.utils.book_new();
const sheet = XLSX.utils.json_to_sheet(data);

XLSX.utils.book_append_sheet(workbook, sheet, "Precios");

// Guardar Excel
XLSX.writeFile(workbook, `data/${fecha}.xlsx`);

console.log("Datos generados correctamente");
