const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

// CONFIGURAÇÃO INICIAL (12K Pontos)
let atendentes = {
    "dono@eb.com": { nome: "Comandante", pontos: 12000, cargo: "DONO", level: 1200 }
};

let ticketsAtivos = {};

io.on('connection', (socket) => {

    socket.on('solicitar_suporte', (dados) => {
        ticketsAtivos[socket.id] = { ...dados, id: socket.id, atendente: null, alerta: false };
        io.emit('novo_ticket_painel', ticketsAtivos[socket.id]);
    });

    socket.on('atender_player', (data) => {
        if(ticketsAtivos[data.ticketId]) {
            ticketsAtivos[data.ticketId].atendente = data.staffEmail;
            socket.join(data.ticketId);
        }
    });

    socket.on('enviar_mensagem', (data) => {
        const { ticketId, texto, remetente } = data;

        if (texto === '/chamar') {
            ticketsAtivos[ticketId].alerta = true;
            io.emit('novo_ticket_painel', ticketsAtivos[ticketId]); // Atualiza painel com alerta
            return;
        }

        if (texto === '/off') {
            // Regra: /off ganha apenas 0.01 pts
            processarPontos(ticketId, 0.01);
            return;
        }

        if (texto === '/concluir') {
            io.to(ticketId).emit('solicitar_avaliacao');
            return;
        }

        io.to(ticketId).emit('receber_mensagem', { texto, remetente });
    });

    socket.on('avaliar_atendimento', (data) => {
        const { ticketId, estrelas } = data;
        const ticket = ticketsAtivos[ticketId];
        if(!ticket) return;

        // Regra de Pontos: 1 base (ou 2 se superior) + (0.3 * estrelas)
        let base = 1.0; 
        let bonus = estrelas * 0.3;
        processarPontos(ticketId, base + bonus);
    });

    function processarPontos(id, total) {
        const ticket = ticketsAtivos[id];
        if(ticket && atendentes[ticket.atendente]) {
            atendentes[ticket.atendente].pontos += total;
            atendentes[ticket.atendente].level = Math.floor(atendentes[ticket.atendente].pontos / 10);
            delete ticketsAtivos[id];
            io.to(id).emit('atendimento_encerrado');
            console.log(`Pontos Processados para ${ticket.atendente}: +${total}`);
        }
    }
});

http.listen(3000, () => console.log('SISTEMA EB ONLINE'));
