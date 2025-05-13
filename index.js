const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

// Usa variables de entorno (Config Vars de Heroku)
const VERIFY_TOKEN = process.env.VERIFY_TOKEN; 
const ACCESS_TOKEN = process.env.ACCESS_TOKEN; 

// Verificación del webhook (GET)
app.get('/webhook', (req, res) => {
  console.log("Token recibido:", req.query['hub.verify_token']); // Para debug
  if (req.query['hub.verify_token'] === VERIFY_TOKEN) {
    console.log("Webhook verificado!");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Error: Token de verificación incorrecto");
    res.sendStatus(403);
  }
});

// Procesar mensajes (POST)
app.post('/webhook', (req, res) => {
  try {
    const entry = req.body.entry[0];
    const changes = entry.changes[0];
    const message = changes.value.messages?.[0];

    if (message && message.type === 'text') {
      const responseMessage = `
🌟 *Bienvenido a Sharma Studio* 🌟 

¿En qué puedo ayudarte hoy? Responde con el número:

1. *Diseño Gráfico*  
2. *Manejo de Redes Sociales*  
3. *Programación de Página Web*  
4. *Impresión de Materiales*  
5. *Hablar con un Agente*  
6. *Listados de precio*  
7. *Cotización*  
      `;

      axios.post(`https://graph.facebook.com/v18.0/${changes.value.metadata.phone_number_id}/messages`, {
        messaging_product: "whatsapp",
        to: message.from,
        text: { body: responseMessage }
      }, {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
    }
    res.sendStatus(200);
  } catch (error) {
    console.error("Error en POST /webhook:", error);
    res.sendStatus(500);
  }
});

// Usa el puerto de Heroku o 3000 localmente
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));