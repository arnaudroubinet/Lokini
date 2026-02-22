# Lokini — Spécifications du projet

## 1. Vision du produit

Lokini est une application client-serveur permettant d'échanger des documents texte (sans média) entre devices. Un document peut prendre différentes formes : note, to-do, liste de courses, etc. Le système de types de documents est extensible.

### Principes fondamentaux

- **Privacy-first** : tout est chiffré côté device avant envoi. Le serveur ne peut jamais lire le contenu des documents.
- **Local-first** : les données vivent sur le device. Le serveur n'est qu'une aide à la synchronisation.
- **Simplicité** : toute la complexité technique (chiffrement, synchronisation) doit être invisible pour l'utilisateur.

## 2. Problème résolu

Partager des informations textuelles entre personnes de manière simple et privée. Lokini n'est pas une messagerie : c'est un outil de partage de documents.

## 3. Utilisateurs cibles

Tout le monde. L'application doit être accessible sans compétence technique particulière.

## 4. Fonctionnement général

### 4.1 Modèle unifié : le document comme unité centrale

Il n'y a pas de distinction entre synchronisation multi-device et partage multi-utilisateur. Le mécanisme est unique : **un device rejoint un document**. Que ce soit un second téléphone du même utilisateur ou l'appareil d'une autre personne, le fonctionnement est identique.

Un document est partagé entre un ensemble de devices. Chaque device participant peut modifier le document. Les modifications sont bidirectionnelles.

### 4.2 Identité

Il n'y a pas de compte utilisateur. L'identité est basée sur le device. Chaque device possède sa propre identité.

### 4.3 Rejoindre un document

Un device rejoint un document via un **lien ou QR code** contenant un **token unique et à usage unique** (one-shot). Ce token déclenche l'échange de clés de chiffrement entre les devices, permettant au nouveau device de déchiffrer et participer au document.

### 4.4 Synchronisation

Le modèle de synchronisation est pull/push, avec la possibilité de se rapprocher du temps réel (ex: notifications push, polling fréquent, ou WebSocket).

### 4.5 Gestion des conflits

En cas de modifications concurrentes par plusieurs devices, le système effectue une **fusion automatique**.

### 4.6 Plateformes cibles

Toutes les plateformes : iOS, Android, desktop (macOS, Windows, Linux) et web.
