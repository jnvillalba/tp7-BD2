import { MongoClient } from "mongodb";
import { loadEnvFile } from "node:process";

async function main() {
  let client;
  try {
    if (!process.env.MONGODB_URI) {
      loadEnvFile(new URL(".env", import.meta.url));
    }
    const url = process.env.MONGODB_URI;
    if (!url) throw new Error("Falta configurar MONGODB_URI en el .env.");

    client = new MongoClient(url, { serverSelectionTimeoutMS: 10000 });
    await client.connect();

    const db = client.db("laboratorio");
    const collection = db.collection("sensores");

    const resultado = await collection.insertMany([
      { nombre: "Sensor de Humedad", stock: 10 },
      { nombre: "Servo Motor", stock: 5 },
      { nombre: "LED RGB", stock: 20 },
    ]);

    console.log("Sensores insertados:", resultado.insertedCount);
    console.log("IDs:", resultado.insertedIds);
  } catch (error) {
    console.error("Error con el driver:", error.message);
    process.exitCode = 1;
  } finally {
    await client?.close();
  }
}

main();
