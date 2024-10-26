import express from "express";
import { db } from "./db.js";

const registros = express.Router();

// Middleware para verificar id
const validarId = (req, res, next) => {
  const id = Number(req.params.id);

  // Verificar que id sea un numero
  if (isNaN(id)) {
    return res.status(400).send({ mensaje: "id no es un numero" });
  }

  // Verificar que id sea un entero
  if (!Number.isInteger(id)) {
    return res.status(400).send({ mensaje: "id no es un numero entero" });
  }

  // Verificar que id sea un positivo
  if (id <= 0) {
    return res.status(400).send({ mensaje: "id no es un numero positivo" });
  }

  next();
};

// GET /registros
// Consultar por todos los registros
registros.get("/registros", async (req, res) => {
  const [registros] = await db.execute("SELECT * FROM registros");
  res.send(registros);
});

// GET /personas/:id
// Consultar por una persona por su id
personas.get("/:id", validarId, async (req, res) => {
  const id = Number(req.params.id);

  // Ejecuto consulta con parametros
  const sql = "SELECT * FROM datos_personales WHERE id_persona=?";
  const [persona] = await db.execute(sql, [id]);

  // Si no hay personas enviar un 204 (sin contenido)
  if (persona.length === 0) {
    res.status(204).send();
  } else {
    res.send({ persona });
  }
});

// POST /personas/
// Agregar nueva persona
personas.post("/", async (req, res) => {
  const {dni, apellido, nombre} = req.body;

  const [result] = await db.execute(
    "INSERT INTO datos_personales (dni, apellido, nombre) values (?, ?, ?)",
    [dni, apellido, nombre]
  );

  res
    .status(201)
    .send({ persona: { id: result.insertId, dni, apellido, nombre } });
});


// PUT /personas/:id
// Modificar persona
personas.put("/:id", validarId,  async (req, res) => {
  const id = Number(req.params.id)
  
  
  ;
  const {dni, apellido, nombre} = req.body;

  await db.execute("UPDATE datos_personales SET dni=?, apellido=?, nombre=? WHERE id_persona=?", [dni, apellido, nombre, id]);

  res.send({ persona: { id: parseInt(id), dni, apellido, nombre } });
});

// DELETE /personas/:id
// Quitar persona
personas.delete("/:id", async (req, res) => {
  const id = req.params.id;

  await db.execute("DELETE FROM datos_personales WHERE id_persona=?", [id]);

  res.send({ id: parseInt(id) });
});

export default registros;