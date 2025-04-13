require('dotenv').config();
const { App } = require('@slack/bolt');
const fs = require('fs');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

const responsables = JSON.parse(fs.readFileSync('responsables.json', 'utf8'));

app.message(async ({ message, say, client }) => {
  if (message.subtype === 'bot_message') return;

  const text = message.text.toUpperCase();

  for (const palabra in responsables) {
    if (text.includes(palabra)) {
      await client.chat.postMessage({
        channel: message.channel,
        thread_ts: message.ts,
        text: `Responsable de ${palabra} es ${responsables[palabra]}`
      });
    }
  }
});

(async () => {
  await app.start();
  console.log('Lulu Bot está conectado!');
})();