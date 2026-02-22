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

Le nombre maximum de devices par document est **configurable** (défaut : **40**).

### 4.2 Identité

Il n'y a pas de compte utilisateur. L'identité est basée sur le device. Chaque device possède sa propre identité.

### 4.3 Rejoindre un document

Un device rejoint un document via un **lien ou QR code** contenant un **token unique et à usage unique** (one-shot). Ce token déclenche l'échange de clés de chiffrement entre les devices, permettant au nouveau device de déchiffrer et participer au document.

### 4.4 Quitter un document

Un device peut **quitter** un document. Cela :
- Signale le départ aux autres devices participants.
- **Archive** le document en local (dernière version connue).
- L'utilisateur peut ensuite choisir de supprimer son archive locale.

Il n'y a pas de mécanisme d'exclusion. Un participant ne peut pas retirer un autre device d'un document.

### 4.5 Fork

Un participant peut **forker** un document : il crée une copie indépendante du document et choisit quels autres devices l'accompagnent dans ce fork. Le document original continue d'exister indépendamment.

Les devices choisis sont notifiés du fork **via le document original** (le canal de communication existant). Ils n'ont pas besoin d'un nouveau lien d'invitation.

### 4.6 Synchronisation

Le modèle de synchronisation est pull/push, avec la possibilité de se rapprocher du temps réel (ex: notifications push, polling fréquent, ou WebSocket).

La synchronisation utilise des **deltas** (différences) pour les échanges. En local, seul le **dernier état** du document est conservé (pas d'historique des versions).

#### Mode offline

Un device hors ligne travaille en local. Au retour de la connexion :
1. Le device **récupère d'abord l'état distant** (pull).
2. Puis il **pousse ses modifications** (push).

Cet ordre est impératif : toujours pull avant push.

### 4.7 Gestion des conflits

En cas de modifications concurrentes par plusieurs devices, le système effectue une **fusion automatique**.

### 4.8 Plateformes cibles

Toutes les plateformes : iOS, Android, desktop (macOS, Windows, Linux) et web.

## 5. Structure des documents

Chaque document a un **type** qui détermine sa structure. Le type définit les champs, les interactions possibles et le rendu visuel. Le système de types est extensible.

## 6. Architecture serveur

Le serveur est un relais de synchronisation. Il ne peut pas lire le contenu des documents (chiffrement de bout en bout).

- **Instance par défaut** : une instance publique est proposée pour un usage immédiat.
- **Auto-hébergement** : les utilisateurs avancés peuvent déployer leur propre instance de serveur.
