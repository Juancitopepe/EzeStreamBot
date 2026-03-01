const { Client, GatewayIntentBits } = require("discord.js");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Bot is running!");
});

app.listen(PORT, () => {
  console.log(`🌐 Servidor web activo en puerto ${PORT}`);
});

// BOT DISCORD
const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once("ready", () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
});

client.login(process.env.TOKEN);
