const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const admin = require("firebase-admin");

// INICIALIZAÇÃO FIREBASE
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

app.use(express.static('public'));

// Dados iniciais do Dono (Carregados no Firebase se não existirem)
const donoEmail = "ruanopresidenteoi@gmail.com";

io.on('connection', (socket) => {
    
    // LOGIN COM PERSISTÊNCIA
    socket.on('tentar_login', async (dados) => {
        const doc = await db.collection('staff').doc(dados.email).get();
        if (doc.exists && doc.data().senha === dados.senha) {
            socket.emit('login_sucesso', { email: dados.email, ...doc.data() });
        } else if (dados.email === donoEmail && dados.senha === "FAMILIA900%$") {
            socket.emit('login_sucesso', { email: donoEmail, cargo: "DONO", nome: "Comandante Ruan" });
        } else {
            socket.emit('login_erro', "Credenciais Inválidas.");
        }
    });

    // TRAVA DE ATENDIMENTO E LOGS
    let ticketsAtivos = {};

    socket.on('solicitar_suporte', (dados) => {
        ticketsAtivos[socket.id] = { ...dados, id: socket.id, status: 'ABERTO', alerta: false };
        io.emit('novo_ticket_painel', ticketsAtivos[socket.id]);
    });

    socket.on('enviar_mensagem', (data) => {
        const tId = data.ticketId || socket.id;
        const msg = data.texto.trim();

        if (msg.startsWith('/')) {
            if (msg === '/chamar' && data.remetente === 'PLAYER') {
                ticketsAtivos[tId].alerta = true;
                io.emit('novo_ticket_painel', ticketsAtivos[tId]);
            }
            if (msg === '/off' && data.remetente !== 'PLAYER') {
                finalizarSessao(tId, 0.01, socket);
            }
            if (msg === '/concluir' && data.remetente !== 'PLAYER') {
                io.to(tId).emit('solicitar_avaliacao');
            }
            return;
        }
        io.to(tId).emit('receber_mensagem', { texto: msg, remetente: data.remetente });
    });

    socket.on('avaliar_atendimento', async (data) => {
        const t = ticketsAtivos[socket.id];
        if(!t) return;
        const staffDoc = await db.collection('staff').doc(t.atendente).get();
        const base = staffDoc.data().cargo === 'SUPERIOR' ? 2.0 : 1.0;
        const total = base + (data.estrelas * 0.3);
        finalizarSessao(socket.id, total, socket);
    });

    async function finalizarSessao(id, pts, s) {
        const t = ticketsAtivos[id];
        if(t && t.atendente) {
            const ref = db.collection('staff').doc(t.atendente);
            const doc = await ref.get();
            const novosPontos = (doc.data().pontos || 0) + pts;
            await ref.update({ pontos: novosPontos, level: Math.floor(novosPontos / 10) });
            
            io.to(id).emit('atendimento_encerrado');
            delete ticketsAtivos[id];
            io.emit('atualizar_painel_admin');
        }
    }
});

http.listen(3000, () => console.log('SISTEMA OPERACIONAL EB ATIVO'));
