const { Client, GatewayIntentBits } = require("discord.js");
const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Bot is running!");
});

app.listen(PORT, () => {
  console.log(`🌐 Servidor web activo en puerto ${PORT}`);
});

// ===== DISCORD =====
const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once("ready", () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
  setInterval(checkLive, 60000); // cada 60 segundos
});

client.login(process.env.TOKEN);

// ===== IDS SEPARADOS (IMPORTANTE) =====
const DISCORD_CHANNEL_ID = "1384310741632286782";
const YOUTUBE_CHANNEL_ID = "UCKAay8tgsF3tFxD7BWx9XHQ";

const API_KEY = process.env.YOUTUBE_API_KEY;

let lastLiveId = null;

// ===== FUNCION QUE REVISA SI ESTA EN VIVO =====
async function checkLive() {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search`,
      {
        params: {
          part: "snippet",
          channelId: YOUTUBE_CHANNEL_ID, // 👈 ahora usa el correcto
          eventType: "live",
          type: "video",
          key: API_KEY
        }
      }
    );

    const items = response.data.items;

    if (items.length > 0) {
      const liveVideo = items[0];
      const liveId = liveVideo.id.videoId;
      const title = liveVideo.snippet.title;

      if (liveId !== lastLiveId) {
  console.log("🔴 STREAM DETECTADO:");
  console.log("Título:", title);
  console.log("Link:", `https://youtube.com/watch?v=${liveId}`);

  lastLiveId = liveId;

  const canal = client.channels.cache.get(DISCORD_CHANNEL_ID);
  if (canal) {
    canal.send(`🔴 ¡Está en vivo!\n**${title}**\nhttps://youtube.com/watch?v=${liveId}`);
  }
} else {
        console.log("🟡 Sigue el mismo stream.");
      }

    } else {
      console.log("⚫ No está en vivo.");
      lastLiveId = null;
    }

  } catch (error) {
    console.error("❌ Error al consultar YouTube:", error.message);
  }
}
