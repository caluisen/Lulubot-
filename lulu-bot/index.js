require('dotenv').config();
const { App } = require('@slack/bolt');
const fs = require('fs');

const app = new App({
  token: process.env.xoxb-1226494846485-8750724387028-pgJD6edXvAPg9x6NeE6yETfE,
  appToken: process.env.xapp-1-A08MXP6GUGL-8764650011008-be8e11c41fd86342e1287344acc17e16f71bb2365719ff61ec52c83834c68e7d,
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
