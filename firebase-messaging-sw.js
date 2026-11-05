/* Service worker des notifications (Firebase Cloud Messaging) — à garder à côté de index.html */
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBxwA5rcBIQeSdlRTNPM92xTrGEdRxuA8c",
  authDomain: "agenda-famille-d6eaf.firebaseapp.com",
  projectId: "agenda-famille-d6eaf",
  storageBucket: "agenda-famille-d6eaf.firebasestorage.app",
  messagingSenderId: "851152496646",
  appId: "1:851152496646:web:9cac6e4dd25a80be7e3b87"
});
// Les notifications avec titre/texte sont affichées automatiquement par Firebase,
// et un appui ouvre l'agenda (lien envoyé par le serveur).
firebase.messaging();
