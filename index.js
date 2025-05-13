const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const VERIFY_TOKEN = 'sharma_token_2024'; 
const ACCESS_TOKEN = 'EAGmoQAdU2WoBO3Rjjy5fRijmi1stJPpN9jLozDXghmJ2C3RaaKZBNjrOlSgfes8YrCBSZCuhzQ79i0XlQEXi9WLK8SUWfMqkZB2c1xe5MdCYXfrfH5aZCXvxeE1ChC6WnOMF5a94fuckfNvGQacK1yFVnkgQM1rlK2pc9ZAl2ZCw5T6PXNwcnMnS3Jr4X65kiJSbZAj4BWTxF3XxYIxYStKr0TfsooKVHzNQKcg'; 

// Verificación inicial del webhook
app.get('/webhook', (req, res) => {
  if (req.query['hub.verify_token'] === VERIFY_TOKEN) {
    res.send(req.query['hub.challenge']);
  } else {
    res.sendStatus(403);
  }
});

// Procesar mensajes entrantes
app.post('/webhook', (req, res) => {
  const entry = req.body.entry[0];
  const changes = entry.changes[0];
  const message = changes.value.messages?.[0];

  if (message && message.type === 'text') {
    const userMessage = message.text.body.toLowerCase();
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

    // Enviar respuesta
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
});

app.listen(3000, () => console.log('Server running'));