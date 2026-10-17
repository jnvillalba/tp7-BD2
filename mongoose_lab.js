import mongoose from "mongoose";
import { loadEnvFile } from "node:process";

// El esquema define los tipos y las validaciones de los componentes.
const componenteSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    stock: { type: Number },
  },
  { timestamps: true },
);

// El tercer argumento fija el nombre de la colección.
const Componente = mongoose.model(
  "Componente",
  componenteSchema,
  "componentes",
);

async function main() {
  try {
    if (!process.env.MONGODB_URI) {
      loadEnvFile(new URL(".env", import.meta.url));
    }
    const url = process.env.MONGODB_URI;
    if (!url) throw new Error("Falta configurar MONGODB_URI en el .env.");

    await mongoose.connect(url, {
      dbName: "laboratorio",
      serverSelectionTimeoutMS: 10000,
    });

    const componente = await Componente.create({
      nombre: "Sensor Ultrasónico",
      stock: 8,
    });

    console.log("Componente insertado:", componente.toObject());
  } catch (error) {
    console.error("Error con Mongoose:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

main();
