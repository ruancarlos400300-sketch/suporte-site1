const express = require('express');
const path = require('path');
const app = express();

// Porta dinâmica para o Render ou 3000 local
const PORT = process.env.PORT || 3000;

// Serve os arquivos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// --- ROTAS DE ACESSO ---

// Rota para o Player (Página Inicial)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota de Login (O que a Staff deve acessar)
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

// Redirecionamento de segurança: se a rota não existir, volta para o início
app.get('*', (req, res) => {
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`SISTEMA MILITAR ATIVO NA PORTA: ${PORT}`);
});
