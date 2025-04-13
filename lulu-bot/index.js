require('dotenv').config();
const { App } = require('@slack/bolt');
const fs = require('fs');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,  // Asegúrate de tener esto en tu archivo .env
  appToken: process.env.SLACK_APP_TOKEN,  // Asegúrate de tener esto en tu archivo .env
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN
});

// Lee el archivo 'responsables.json' para asignar responsables
const responsables = JSON.parse(fs.readFileSync('responsables.json', 'utf8'));

// Escucha los mensajes en Slack
app.message(async ({ message, say, client }) => {
  // Evita que el bot responda a sus propios mensajes
  if (message.subtype === 'bot_message') return;

  const text = message.text.toUpperCase();  // Convierte el mensaje a mayúsculas para hacer una búsqueda insensible a mayúsculas/minúsculas

  // Verifica si alguna palabra clave en el mensaje corresponde a un área
  for (const palabra in responsables) {
    if (text.includes(palabra)) {
      await client.chat.postMessage({
        channel: message.channel,
        thread_ts: message.ts,  // Responde en el hilo del mensaje original
        text: `Responsable de ${palabra} es ${responsables[palabra]}`  // Mensaje con el responsable
      });
    }
  }
});

// Inicia la aplicación
(async () => {
  await app.start();
  console.log('Lulu Bot está conectado!');
})();
