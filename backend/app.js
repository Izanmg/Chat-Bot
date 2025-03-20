require("dotenv").config();
const express = require("express");
const { OpenAI } = require("openai");
const cors = require("cors");
const systemPrompt = require("./systemPrompt.js");

const app = express();
app.use(cors());
app.use(express.json());

console.log("Clave API cargada:", process.env.OPENAI_API_KEY ? "Sí" : "No");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Almacena los historiales de cada sesión (simple implementación en memoria)
const chatSessions = {};



app.post("/chat", async (req, res) => {
  try {
    console.log("Petición recibida con body:", req.body);
    const { sessionId, message, mode } = req.body;
    console.log("Mensaje del usuario:", message);
    console.log("Modo seleccionado:", mode);
    console.log("ID de sesión:", sessionId);

    if (!message) {
      return res.status(400).json({ error: "Por favor, envía un mensaje." });
    }

    // Si no existe una sesión, se crea una nueva con el contexto inicial
    if (!chatSessions[sessionId]) {
      console.log("Nueva sesión creada:", sessionId);
      chatSessions[sessionId] = [
        { role: "system", content: systemPrompt }
      ];
    }

    // Agregar el mensaje del usuario al historial
    chatSessions[sessionId].push({ role: "user", content: message });

    // Enviar la conversación a OpenAI (sin repetir el contexto inicial)
    console.log("Enviando petición a OpenAI...");
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: chatSessions[sessionId], // Solo enviamos el historial sin repetir el contexto
    });

    const botMessage = response.choices[0].message.content;
    console.log("Respuesta de OpenAI:", botMessage);

    // Agregar la respuesta del bot al historial
    chatSessions[sessionId].push({ role: "assistant", content: botMessage });

    // Convertir Markdown a HTML
    res.json({ message: botMessage });

  } catch (error) {
    console.error("Error detallado:", error.message);
    console.error("Código de error (si existe):", error.code);
    console.error("Respuesta completa del error:", error.response?.data);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

app.listen(3000, () => console.log("Servidor en http://localhost:3000"));
