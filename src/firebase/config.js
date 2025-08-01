// Configuraci√≥n de Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = { 
  apiKey: "AIzaSyBJDM7QRqfjuP1WMNvAY2jgMRmECbgunu8", 
  authDomain: "ana-plantas.firebaseapp.com", 
  projectId: "ana-plantas", 
  storageBucket: "ana-plantas.firebasestorage.app", 
  messagingSenderId: "926863646323", 
  appId: "1:926863646323:web:fd2f16f822fae8cd4bd406" 
}; 

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };"// Limpieza de configuraci¢n innecesaria en Firebase" 
