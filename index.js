import express from "express";
import cors from "cors";
import registros from "./registros.js";
import plantas from "./plantas.js";
import { conectarDB } from "./db.js";
import { rateLimit } from "express-rate-limit";
import getWeather from "./weather.js";

const app = express();
const port = 3000;

const dailyLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 100,
  message: "Ha excedido el límite de 100 solicitudes diarias",
  standardHeaders: true,
  legacyHeaders: false,
});

conectarDB();
console.log("Conectado a base de datos");

app.use(express.json());
app.use(cors());
app.use(dailyLimiter);

app.get('/clima', async (req, res) => {
  try {
    const city = req.query.city || 'La Rioja';
    const weatherData = await getWeather(city);
    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los datos climáticos' });
  }
});

app.get("/", (req, res) => {
  res.send("Hola mundo!");
});

app.use("/", plantas);

app.use("/", registros);

app.listen(port, () => {
  console.log(`La aplicacion esta funcionando en: ${port}`);
});
