import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Dados do "Web App" criado no console do Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyDZCbkjA686LIJUmwX0Sf2BKtmOQtlqvek',
  authDomain: 'ap08---app-de-lista-de-c-9856a.firebaseapp.com',
  projectId: 'ap08---app-de-lista-de-c-9856a',
  storageBucket: 'ap08---app-de-lista-de-c-9856a.firebasestorage.app',
  messagingSenderId: '859741963218',
  appId: '1:859741963218:web:cd608042d42523116f7e0b',
};

// Garante uma única instância do Firebase (evita erro no "recarregar" do Expo)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Autenticação:
// - No navegador (web) o Firebase já salva o login sozinho.
// - No celular (Android/iOS) salvamos o login no AsyncStorage,
//   assim o usuário continua logado ao fechar e abrir o app.
let auth;
if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (erro) {
    // Se o Auth já foi iniciado antes (ex.: após um "reload"), só reaproveita
    auth = getAuth(app);
  }
}

const db = getFirestore(app);

export { app, auth, db };
