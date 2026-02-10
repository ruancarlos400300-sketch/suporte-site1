const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static('public'));

// BANCO DE DADOS EM MEMÓRIA (Para persistência total, conectaremos ao Firebase no próximo passo)
let atendentes = {
    "dono@eb.com": { nome: "Comandante Supremo", pontos: 12000, cargo: "DONO", senha: "123" }
};

let ticketsAtivos = {}; // Armazena dados do player e quem está atendendo
let logs = [];

io.on('connection', (socket) => {

    // --- FLUXO DO CLIENTE (PLAYER) ---
    socket.on('solicitar_suporte', (dados) => {
        const ticketId = socket.id;
        ticketsAtivos[ticketId] = {
            id: ticketId,
            nick: dados.nick,
            roblox: dados.roblox,
            problema: dados.problema,
            status: 'AGUARDANDO',
            mensagens: [],
            atendente: null,
            alerta: false
        };
        io.emit('novo_ticket_painel', ticketsAtivos[ticketId]);
    });

    // --- FLUXO DO STAFF (CAC) ---
    socket.on('atender_player', (data) => {
        const { ticketId, staffEmail } = data;
        if (ticketsAtivos[ticketId]) {
            ticketsAtivos[ticketId].atendente = staffEmail;
            ticketsAtivos[ticketId].status = 'EM_ATENDIMENTO';
            socket.join(ticketId); // Trava o staff no canal do player
            io.emit('ticket_assumido', { ticketId, staffNome: atendentes[staffEmail].nome });
        }
    });

    // --- COMANDOS DE ELITE ---
    socket.on('enviar_mensagem', (data) => {
        const { ticketId, texto, remetente } = data;
        
        // Comando /CHAMAR (Alerta para Superiores)
        if (texto === '/chamar') {
            ticketsAtivos[ticketId].alerta = true;
            io.emit('alerta_superior', { ticketId });
            return;
        }

        // Comando /OFF (Encerramento Rápido - 0.01 pts)
        if (texto === '/off') {
            finalizarAtendimento(ticketId, 0.01, "ENCERRADO_OFF");
            return;
        }

        // Comando /CONCLUIR (Inicia Avaliação Robô)
        if (texto === '/concluir') {
            io.to(ticketId).emit('solicitar_avaliacao');
            return;
        }

        io.to(ticketId).emit('receber_mensagem', { texto, remetente });
    });

    // --- SISTEMA DE PONTUAÇÃO E MÉRITO ---
    socket.on('avaliar_atendimento', (data) => {
        const { ticketId, estrelas } = data;
        const ticket = ticketsAtivos[ticketId];
        const staffEmail = ticket.atendente;
        const staff = atendentes[staffEmail];

        let pontosBase = (staff.cargo === 'SUPERIOR') ? 2.0 : 1.0;
        let bonusEstrelas = estrelas * 0.3;
        let totalGanho = pontosBase + bonusEstrelas;

        staff.pontos += totalGanho;
        
        // Cálculo de Level (10 em 10 pontos)
        staff.level = Math.floor(staff.pontos / 10);
        
        finalizarAtendimento(ticketId, totalGanho, "CONCLUIDO");
    });

    function finalizarAtendimento(id, pontos, statusFinal) {
        if (ticketsAtivos[id]) {
            logs.push({ ...ticketsAtivos[id], status: statusFinal, pontosGanhos: pontos, data: new Date() });
            io.to(id).emit('atendimento_encerrado');
            delete ticketsAtivos[id];
            io.emit('atualizar_painel_admin');
        }
    }
});

http.listen(3000, () => console.log('Orbitron EB Online na porta 3000'));
