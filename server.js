const express = require('express');
const path = require('path');
const app = express();

// Define a porta: usa a porta do servidor (Render/Railway) ou a 3000 localmente
const PORT = process.env.PORT || 3000;

// Configura a pasta 'public' como a pasta de arquivos estáticos
// É aqui que devem estar seus arquivos: index.html, login.html, admin.html, dono.html e firebase-config.js
app.use(express.static(path.join(__dirname, 'public')));

// --- ROTAS DO SISTEMA ---

// Rota Principal (Player)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota de Login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Rota do Painel Staff
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Rota do Comando Supremo (Dono)
app.get('/dono', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dono.html'));
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`-----------------------------------------`);
    console.log(`SISTEMA ORBITRON ATIVO NA PORTA: ${PORT}`);
    console.log(`URL LOCAL: http://localhost:${PORT}`);
    console.log(`-----------------------------------------`);
});
