const express = require('express');
const axios = require('axios');
const app = express();

// Middleware crítico
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Para parsear webhook payloads

// Configuración robusta de variables
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

if (!VERIFY_TOKEN || !ACCESS_TOKEN) {
  console.error("ERROR: Faltan variables de entorno VERIFY_TOKEN o ACCESS_TOKEN");
  process.exit(1); // Falla rápido si faltan variables
}

// Health Check (requerido por Heroku)
app.get('/', (req, res) => {
  res.status(200).send('Server is running');
});

// Webhook Verification
app.get('/webhook', (req, res) => {
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  
  console.log(`Intento de verificación con token: ${token}`);
  
  if (token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado");
    return res.status(200).send(challenge);
  }
  
  console.error("❌ Token de verificación incorrecto");
  res.sendStatus(403);
});

// Procesamiento de mensajes
app.post('/webhook', async (req, res) => {
  try {
    console.log("📩 Mensaje recibido:", JSON.stringify(req.body, null, 2));
    
    const entry = req.body.entry?.[0];
    if (!entry) {
      return res.sendStatus(200);
    }

    const changes = entry.changes?.[0];
    const message = changes?.value?.messages?.[0];
    
    if (message?.type === 'text') {
      const response = `🌟 *Bienvenido a Sharma Studio* 🌟 
      
1. Diseño Gráfico  
2. Manejo de Redes*
3. *Programación de Página Web*  
4. *Impresión de Materiales*  
5. *Hablar con un Agente*  
6. *Listados de precio*  
7. *Cotización*  
      `;

      await axios.post(
        `https://graph.facebook.com/v18.0/${changes.value.metadata.phone_number_id}/messages`,
        {
          messaging_product: "whatsapp",
          to: message.from,
          text: { body: response }
        },
        {
          headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    res.sendStatus(200);
  } catch (error) {
    console.error("🔥 Error en webhook:", error);
    res.sendStatus(500);
  }
});

// Inicio del servidor
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Manejo de cierre limpio
process.on('SIGTERM', () => {
  console.log('🛑 Recibido SIGTERM. Cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado');
  });
});