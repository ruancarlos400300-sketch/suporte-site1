const WEBHOOK_URL = "https://discord.com/api/webhooks/1470999572422852729/DKfpTG61oP6w74Riw2UDHQTV2OubxVDxuk4M2iiWx8tNH5uDbnWuEJUqoZ1ZhXdS_uyo";

function enviarLog(titulo, campos, cor) {
    const embed = {
        username: "ORBITRON SYSTEM",
        avatar_url: "https://i.imgur.com/4M7yv7m.png", // Opcional: ícone do seu sistema
        embeds: [{
            title: titulo,
            fields: campos,
            color: cor,
            timestamp: new Date().toISOString(),
            footer: { text: "Orbitron Logs • v2.0" }
        }]
    };

    fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(embed)
    }).catch(err => console.error("Falha ao reportar log:", err));
}
