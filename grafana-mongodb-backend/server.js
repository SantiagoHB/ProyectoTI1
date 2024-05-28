const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const cron = require("node-cron");

const app = express();
const port = 3001;

const mongoUrl = "mongodb://localhost:27017"; // URL de MongoDB
const dbName = "ecovilla_gestion_datos"; // Nombre de la base de datos
const collectionName = "datos_ecovilla"; // Nombre de la colección

app.use(bodyParser.json());

let db;

async function connectToMongoDB() {
  try {
    const client = await MongoClient.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = client.db(dbName);
    console.log(`Conectado a la base de datos: ${dbName}`);
  } catch (err) {
    console.error("Error al conectar a MongoDB", err);
    process.exit(1);
  }
}

connectToMongoDB().then(() => {
  app.listen(port, () => {
    console.log(`Servidor backend ejecutándose en http://localhost:${port}`);
  });
});

// Función para generar datos aleatorios
function generateRandomData() {
  const data = [];
  const currentTime = new Date();
  for (let sensor = 0; sensor < 6; sensor++) {
    // Sensores del 0 al 5
    const temperatura = (Math.random() * 15 + 20).toFixed(1); // Temperatura entre 20°C y 35°C
    const humedad = (Math.random() * 70 + 10).toFixed(1); // Humedad entre 10% y 80%
    const calidadaire = Math.floor(Math.random() * 250); // Calidad del aire entre 0 y 250
    data.push({
      sensor: sensor,
      temperatura: `${temperatura}°C`,
      humedad: `${humedad}%`,
      calidadaire: calidadaire,
      fecha: currentTime.toISOString(),
    });
  }
  return data;
}

// Tarea cron para insertar datos en MongoDB cada 5 segundos
cron.schedule("*/5 * * * * *", async () => {
  if (db) {
    const collection = db.collection(collectionName);
    const data = generateRandomData();
    await collection.insertMany(data);
    console.log("Datos insertados:", data);
  }
});

app.get("/", (req, res) => {
  res.send("Servidor de backend de Grafana con MongoDB");
});

app.get("/search", async (req, res) => {
  if (!db) return res.status(500).send("No conectado a la base de datos");
  try {
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((col) => col.name);
    res.json(collectionNames);
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

app.post("/query", async (req, res) => {
  if (!db) return res.status(500).send("No conectado a la base de datos");
  try {
    const { targets } = req.body;

    // Procesar las consultas para cada target
    const queries = targets.map(async (target) => {
      const [metric, sensorNumber] = target.target.split("_"); // Obtener la métrica y el número de sensor
      const collection = db.collection(collectionName);
      const documents = await collection
        .find({ sensor: parseInt(sensorNumber) })
        .sort({ fecha: 1 })
        .toArray();

      if (!documents || documents.length === 0) {
        throw new Error("No se encontraron datos en la colección");
      }

      const datapoints = documents.map((doc) => [
        parseFloat(doc[metric]), // Asegurar que el valor sea un número
        new Date(doc.fecha).getTime(),
      ]);

      return {
        target: target.target,
        datapoints: datapoints,
      };
    });

    const data = await Promise.all(queries);
    res.json(data);
  } catch (err) {
    console.error("Error en el endpoint /query", err);
    res.status(500).send(err.toString());
  }
});
