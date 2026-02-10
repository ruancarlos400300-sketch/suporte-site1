// Substitua pelos dados que o Firebase te deu em "Configurações do Projeto"
const firebaseConfig = {
    apiKey: "BKNXZNBNWR3HItdLx5s5_sHO94qXlGzKws5olMNJvrycI7bVUTFg1NsnCb45GwgkpkRSbQc3DVdueBAvEwys_tk",
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
