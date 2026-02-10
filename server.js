const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Rotas diretas para facilitar o acesso
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));
app.get('/dono', (req, res) => res.sendFile(path.join(__dirname, 'public', 'dono.html')));

app.listen(PORT, () => {
    console.log(`Servidor Orbitron rodando na porta ${PORT}`);
});
