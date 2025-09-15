import express from "express";
import bodyParser from "body-parser";
import neo4j from "neo4j-driver";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(bodyParser.json());

// 🔹 Conexión a Neo4j
const driver = neo4j.driver(
  "bolt://neo4j_db:7687",
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);


// ✅ Endpoint raíz
app.get("/", (req, res) => {
  res.send("API de Artwork corriendo 🚀");
});

// ✅ GET -> listar artworks
app.get("/artworks", async (req, res) => {
  const session = driver.session();
  try {
    const result = await session.run("MATCH (a:Artwork) RETURN a LIMIT 20");
    const artworks = result.records.map(r => r.get("a").properties);
    res.json(artworks);
  } catch (error) {
    console.error("Error en GET /artworks:", error);
    res.status(500).json({ error: "Error obteniendo artworks" });
  } finally {
    await session.close();
  }
});

// ✅ POST -> crear un nuevo artwork
app.post("/artworks", async (req, res) => {
  const { id, titulo, anio } = req.body;

  if (!id || !titulo) {
    return res.status(400).json({ error: "Faltan campos obligatorios: id y titulo" });
  }

  const session = driver.session();
  try {
    await session.run(
      "CREATE (:Artwork {id:$id, titulo:$titulo, anio:$anio})",
      { id, titulo, anio: anio ? parseInt(anio) : null }
    );
    res.json({ msg: "Nuevo Artwork creado ✅" });
  } catch (error) {
    console.error("Error en POST /artworks:", error);
    res.status(500).json({ error: "Error creando artwork" });
  } finally {
    await session.close();
  }
});

// 🔹 Inicializar servidor
const PORT = process.env.EXPRESS_PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
