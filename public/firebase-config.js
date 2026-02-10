// Substitua pelos dados que o Firebase te deu em "Configurações do Projeto"
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_PROJETO.firebaseapp.com",
    databaseURL: "https://orbitron-eb.firebaseio.com",
    projectId: "orbitron-eb",
    storageBucket: "orbitron-eb.appspot.com",
    messagingSenderId: "ID_MENSAGEM",
    appId: "ID_APP"
};

// Inicialização Única
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();
const auth = firebase.auth();
