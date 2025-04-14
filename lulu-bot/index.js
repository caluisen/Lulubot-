require('dotenv').config(); // Cargar variables del archivo .env

const { WebClient } = require('@slack/web-api');

// Usar la variable de entorno SLACK_TOKEN
const token = process.env.SLACK_TOKEN;

const web = new WebClient(token);

const sendMessage = async () => {
    try {
        const result = await web.chat.postMessage({
            channel: '#general',
            text: '¡Hola desde tu bot de Slack en Amazon Linux!'
        });
        console.log('Mensaje enviado: ', result.ts);
    } catch (error) {
        console.error('Error al enviar mensaje: ', error);
    }
};

sendMessage();

require('dotenv').config();  // Asegúrate de que dotenv cargue las variables de entorno
const { App } = require('@slack/bolt');
const fs = require('fs');

// Manejo de errores al leer el archivo JSON
let responsables;
try {
  responsables = JSON.parse(fs.readFileSync('responsables.json', 'utf8'));
} catch (error) {
  console.error('Error al leer el archivo responsables.json:', error);
  process.exit(1);  // Detenemos la ejecución si el archivo no se puede leer
}

// Configuración del bot con los tokens desde el archivo .env
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,  // Asegúrate de que tienes este token en tu archivo .env
 appToken: process.env.SLACK_APP_TOKEN,  // Asegúrate de que tienes este token en tu archivo .env
  socketMode: true,
});

app.message(async ({ message, say, client }) => {
  try {
    // Ignorar mensajes del bot
    if (message.subtype === 'bot_message') return;

    console.log("📩 Mensaje recibido:", message.text);

    const text = message.text.toUpperCase();

    // Respuesta genérica de bienvenida


    // Verificar si el mensaje menciona algún rol del archivo responsables.json
    for (const persona of responsables) {
      if (text.includes(persona.rol.toUpperCase())) {
        await client.chat.postMessage({
          channel: message.channel,
          thread_ts: message.ts,
          text: `Responsable de ${persona.rol} es ${persona.nombre}`
        });
      }
    }

  } catch (error) {
    console.error("❌ Error al responder:", error);
  }
});

// Inicia la aplicación
(async () => {
  try {
    await app.start();
    console.log('Lulu Bot está conectado!');
  } catch (error) {
    console.error('Error al iniciar el bot:', error);
  }
})();
