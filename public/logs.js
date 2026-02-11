const WEBHOOK_URL = "https://discord.com/api/webhooks/1470999572422852729/DKfpTG61oP6w74Riw2UDHQTV2OubxVDxuk4M2iiWx8tNH5uDbnWuEJUqoZ1ZhXdS_uyo";

function enviarLog(titulo, campos, cor) {
    const embed = {
        username: "CENTRAL DE INTELIGÊNCIA - EB",
        avatar_url: "https://i.imgur.com/8Y6E7Gv.png", // Brasão EB
        embeds: [{
            title: titulo,
            fields: campos,
            color: cor,
            timestamp: new Date().toISOString(),
            footer: { text: "SISTEMA ORBITRON v3.0 | EXÉRCITO BRASILEIRO" }
        }]
    };

    fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(embed)
    }).catch(err => console.error("Erro na comunicação com o Quartel General:", err));
}
