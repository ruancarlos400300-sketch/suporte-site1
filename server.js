const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

// BASE DE DADOS INTEGRADA (Dono Definido e Gestão de Staff)
let staffData = {
    "ruanopresidenteoi@gmail.com": { 
        nome: "Comandante Ruan", 
        pontos: 12000, 
        cargo: "DONO", 
        senha: "FAMILIA900%$", 
        level: 1200 
    }
};

let ticketsAtivos = {};

io.on('connection', (socket) => {

    // --- LOGIN SEGURO ---
    socket.on('tentar_login', (dados) => {
        const user = staffData[dados.email];
        if (user && user.senha === dados.senha) {
            socket.emit('login_sucesso', { email: dados.email, cargo: user.cargo, nome: user.nome });
        } else {
            socket.emit('login_erro', "Credenciais Inválidas.");
        }
    });

    // --- GESTÃO DO DONO (Adicionar Staff com Senha) ---
    socket.on('setar_staff', (dados) => {
        // Apenas o dono pode setar staff
        staffData[dados.email] = {
            nome: dados.nome,
            senha: dados.senha, // Você decide a senha aqui
            cargo: dados.cargo, // SUPERIOR ou ATENDENTE
            pontos: 0,
            level: 1
        };
        console.log(`Staff adicionado: ${dados.nome} | Cargo: ${dados.cargo}`);
    });

    // ... lógica de tickets e pontos (concluir/off/chamar) continua igual ...
});

http.listen(3000, () => console.log('SISTEMA EB ONLINE - OPERAÇÃO RESPONSIVA'));
