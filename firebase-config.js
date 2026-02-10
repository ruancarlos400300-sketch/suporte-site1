// Configuração de Banco de Dados Profissional
const admin = require("firebase-admin");

// Você obterá este arquivo no console do Firebase (Projeto > Configurações > Contas de Serviço)
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://seu-projeto-eb.firebaseio.com"
});

const db = admin.firestore();

// Função para salvar pontos de forma blindada
async function salvarProgressoStaff(email, pontos, level) {
    await db.collection('staff').doc(email).set({
        pontos: pontos,
        level: level,
        ultima_atualizacao: new Date()
    }, { merge: true });
}

module.exports = { db, salvarProgressoStaff };
