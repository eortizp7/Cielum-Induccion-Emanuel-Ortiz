
import { generarReporte } from "./reporte.js";
import { writeFile } from "fs/promises";

async function main() {
  try {
    console.log("Generando reporte...");

    const reporte = await generarReporte();

    console.log("Reporte generado:");
    console.log(reporte);

    await writeFile("reporte.json", JSON.stringify(reporte, null, 2));

    console.log("Reporte guardado en reporte.json");
  } catch (error) {
    console.log("Ocurrió un error al generar el reporte:", error.message);
  }
}

main();