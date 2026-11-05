# Notre Agenda – guide d'installation

Résultat final : une adresse du type `https://TON-PSEUDO.github.io/agenda/`, un email + mot de passe pour toi, un autre pour ta femme, et une icône « Agenda » sur l'écran d'accueil de vos iPhone. Tout est gratuit.

Compte environ 30 minutes, à faire une seule fois, de préférence sur un ordinateur.

---

## Étape 1 – Créer la base de données (Firebase)

1. Va sur https://console.firebase.google.com et connecte-toi avec un compte Google.
2. **Créer un projet** → nom : `notre-agenda` → tu peux désactiver Google Analytics → Créer.
3. Menu de gauche **Build → Authentication** → *Commencer* → onglet **Sign-in method** → active **Adresse e-mail/Mot de passe** (seulement la 1re option) → Enregistrer.
4. Toujours dans Authentication, onglet **Users** → **Ajouter un utilisateur** :
   - ton email + un mot de passe
   - l'email de ta femme + un mot de passe (elle pourra le changer via « Mot de passe oublié »)
5. Onglet **Settings → User actions** : **décoche « Enable create (sign-up) »**. Personne d'autre ne pourra se créer un compte.
6. Menu **Build → Firestore Database** → *Créer une base de données* → emplacement **europe-west1 (Belgique)** → mode **production** → Créer.
7. Dans Firestore, onglet **Règles** : remplace tout par ceci (mets vos 2 vrais emails, en minuscules) puis **Publier** :

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function autorise() {
      return request.auth != null
        && request.auth.token.email in ['ton.email@hotmail.com', 'email.de.ta.femme@exemple.com'];
    }
    match /{document=**} {
      allow read, write: if autorise();
    }
  }
}
```

8. Roue dentée ⚙ en haut à gauche → **Paramètres du projet** → en bas, *Vos applications* → icône **`</>`** (Web) → surnom `agenda` → *Enregistrer l'application* (pas besoin de Firebase Hosting).
   Firebase affiche un bloc `const firebaseConfig = { apiKey: "...", ... }`. **Garde cette page ouverte.**

## Étape 2 – Coller la config dans l'appli

Ouvre `index.html` avec un éditeur de texte (Bloc-notes, TextEdit en mode texte brut, ou VS Code). Tout en haut du script, remplace :

```js
const FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  ...
```

par les valeurs que Firebase t'a données (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId). Enregistre.

> Ces clés ne sont pas des secrets : elles peuvent être visibles publiquement. Ce qui protège vos données, ce sont les **règles** de l'étape 1.7 et les comptes que toi seul as créés.

## Étape 3 – Mettre en ligne (GitHub Pages)

1. Crée un compte sur https://github.com (gratuit). Ton pseudo apparaîtra dans l'adresse.
2. **New repository** → nom : `agenda` → **Public** → Create.
3. *uploading an existing file* → glisse les 6 fichiers : `index.html`, `manifest.webmanifest`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `README.md` → **Commit changes**.
4. Dans le dépôt : **Settings → Pages** → Source : *Deploy from a branch* → Branch : `main` / `(root)` → Save.
5. Après 1 à 2 minutes, l'adresse s'affiche : `https://TON-PSEUDO.github.io/agenda/`.

Retourne dans Firebase → **Authentication → Settings → Domaines autorisés** → *Ajouter un domaine* → `TON-PSEUDO.github.io`.

## Étape 4 – Sur les iPhone

1. Ouvre l'adresse dans **Safari** (pas Chrome).
2. Connecte-toi avec ton email et ton mot de passe.
3. Bouton **Partager** (carré avec flèche) → **Sur l'écran d'accueil** → Ajouter.
4. L'icône « Agenda » s'ouvre maintenant en plein écran, comme une appli.
5. La première fois dans l'appli : **Réglages** → « Sur cet appareil, je suis » → choisis ton prénom (ta femme choisit le sien). Renomme aussi « Elle » avec son prénom.

Envoie simplement l'adresse à ta femme avec son mot de passe, elle refait l'étape 4.

---

## Modifier l'appli plus tard

Demande à Claude les changements, puis sur GitHub : ouvre `index.html` → icône crayon (ou *Add file → Upload files* pour remplacer) → Commit. Garde bien ta config Firebase dans le nouveau fichier.
Sur l'iPhone, la nouvelle version arrive en fermant puis rouvrant l'appli (parfois 2 fois, le temps que le cache se mette à jour).

## Bon à savoir

- **Hors ligne** : l'appli fonctionne sans réseau, les modifs partent dès que la connexion revient.
- **Sauvegarde** : Réglages → Exporter (JSON), de temps en temps.
- **Gratuit** : l'offre gratuite Firebase (Spark) couvre très largement deux personnes. Aucune carte bancaire n'est demandée.
- **Mode démo** : tant que la config est vide, l'appli tourne en démo avec des exemples, sans partage.
