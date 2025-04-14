require('dotenv').config();  // Asegúrate de que dotenv cargue las variables de entorno
const { App } = require('@slack/bolt');
const fs = require('fs');

// Configuración del bot con los tokens desde el archivo .env
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,  // Asegúrate de que tienes este token en tu archivo .env
  appToken: process.env.SLACK_APP_TOKEN,  // Asegúrate de que tienes este token en tu archivo .env
  socketMode: true,
});

// Lee el archivo 'responsables.json' para asignar responsables
const responsables = JSON.parse(fs.readFileSync('responsables.json', 'utf8'));

// Escucha los mensajes en Slack
app.message(async ({ message, say, client }) => {
  // Verifica que el mensaje no sea del bot (para evitar que el bot se responda a sí mismo)
  if (message.subtype === 'bot_message') return;

  // Log para verificar que el bot está recibiendo los mensajes
  console.log('Mensaje recibido:', message);

  // Convierte el texto del mensaje a mayúsculas para hacer una búsqueda insensible a mayúsculas/minúsculas
  const text = message.text.toUpperCase();

  // Verifica si alguna palabra clave en el mensaje corresponde a un área
  for (const palabra in responsables) {
    if (text.includes(palabra)) {
      // Responde al mensaje en el hilo correspondiente
      await client.chat.postMessage({
        channel: message.channel,
        thread_ts: message.ts,  // Responde en el hilo del mensaje original
        text: `Responsable de ${palabra} es ${responsables[palabra]}`
      });
    }
  }
});

// Inicia la aplicación
(async () => {
  await app.start();
  console.log('Lulu Bot está conectado!');
})();
