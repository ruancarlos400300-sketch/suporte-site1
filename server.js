const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Define a pasta 'public' como a origem dos arquivos do site
app.use(express.static(path.join(__dirname, 'public')));

// Banco de dados em memória (para o histórico e controle de quem está online)
let activeChats = {};

io.on('connection', (socket) => {
    console.log('LOG: Nova conexão estabelecida ID:', socket.id);

    // --- LÓGICA DO CLIENTE ---
    socket.on('start_chat', () => {
        // O cliente entra em uma sala exclusiva baseada no seu ID de conexão
        socket.join(socket.id);
        activeChats[socket.id] = { id: socket.id, status: 'aguardando' };
        
        // Avisa aos administradores que há um novo cliente
        io.emit('update_admin_list', Object.values(activeChats));
    });

    socket.on('client_message', (data) => {
        // Envia a mensagem do cliente para todos os admins autorizados
        io.emit('admin_receive_msg', {
            clientId: socket.id,
            text: data.text,
            time: new Date().toLocaleTimeString()
        });
    });

    // --- LÓGICA DO ADMIN (Dono/Atendente) ---
    socket.on('admin_join', () => {
        socket.join('admin_room'); // Admins entram em uma sala privada
        socket.emit('update_admin_list', Object.values(activeChats));
    });

    socket.on('admin_send_msg', (data) => {
        // O servidor envia a resposta do admin especificamente para aquele cliente
        io.to(data.clientId).emit('client_receive_msg', {
            text: data.text,
            adminName: data.adminName || 'Atendente'
        });
    });

    socket.on('disconnect', () => {
        if (activeChats[socket.id]) {
            delete activeChats[socket.id];
            io.emit('update_admin_list', Object.values(activeChats));
        }
        console.log('LOG: Usuário desconectado');
    });
});

// Porta padrão para sistemas profissionais
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`--- SISTEMA ORBITRON ONLINE ---`);
    console.log(`Porta: ${PORT}`);
});

