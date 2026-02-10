// Substitua pelos dados que o Firebase te deu em "Configurações do Projeto"
const firebaseConfig = {
    apiKey: "AIzaSyD9c-XVte3VsLDSXXRPH8FvxeVcI5XIlec",
    authDomain: "orbitron-eb.firebaseapp.com",
    databaseURL: "https://orbitron-eb-default-rtdb.firebaseio.com",
    projectId: "orbitron-eb",
    storageBucket: "orbitron-eb.firebasestorage.app",
    messagingSenderId: "167183542132",
    appId: "1:167183542132:web:9c1f789df9db75f408ee21"
};

// Inicialização Única
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();
const auth = firebase.auth();
