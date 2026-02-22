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

Il n'y a pas de compte utilisateur. L'identité d'un device est **propre à chaque document** : un device génère un **couple clé privée/publique par document** auquel il participe. Un même appareil physique a donc autant d'identités que de documents rejoints.

Il n'y a pas d'identité globale du device au sens cryptographique.

#### Pseudonyme

L'utilisateur définit un **pseudonyme global** sur son device, utilisé par défaut dans tous les documents. Ce pseudo peut être **surchargé document par document** (par exemple, un surnom différent dans un document partagé en famille vs. au travail).

Le pseudonyme est transmis **chiffré** aux autres participants du document. Le serveur ne le connaît pas.

### 4.3 Création d'un document

Lors de la création d'un document, l'utilisateur **choisit le serveur** sur lequel le document sera hébergé. L'application propose le serveur par défaut (instance publique) mais permet de sélectionner un autre serveur parmi ceux configurés.

Une fois créé, le document est lié à ce serveur : il ne peut pas être migré vers un autre serveur.

### 4.4 Rejoindre un document

Un device rejoint un document via un **lien ou QR code** contenant un **token unique et à usage unique** (one-shot). Ce token déclenche la phase de jonction :
1. **Échange de clés** : le nouveau device reçoit les clés nécessaires pour participer au document.
2. **Transfert du document complet** : un device existant envoie l'état actuel complet du document (chiffré) au nouveau device, via le serveur.

Le nouveau device dispose ainsi immédiatement du document dans son intégralité et peut commencer à recevoir les deltas suivants.

### 4.5 Quitter un document

Un device peut **quitter** un document. Cela :
- Signale le départ aux autres devices participants.
- **Archive** le document en local (dernière version connue).
- L'utilisateur peut ensuite choisir de supprimer son archive locale.

Il n'y a pas de mécanisme d'exclusion. Un participant ne peut pas retirer un autre device d'un document.

### 4.6 Fork

Un participant peut **forker** un document : il crée une copie indépendante du document et choisit quels autres devices l'accompagnent dans ce fork. Le document original continue d'exister indépendamment.

Le fork est un **nouveau document** à part entière : de nouvelles clés privées/publiques sont générées pour chaque device participant. Les clés du document original ne sont pas réutilisées.

Les devices choisis sont notifiés du fork **via le document original** (le canal de communication existant). Ils n'ont pas besoin d'un nouveau lien d'invitation.

### 4.7 Synchronisation

Le modèle de synchronisation est pull/push, avec la possibilité de se rapprocher du temps réel (ex: notifications push, polling fréquent, ou WebSocket).

La synchronisation utilise des **deltas** (différences) pour les échanges. En local, seul le **dernier état** du document est conservé (pas d'historique des versions).

#### Mode offline

Un device hors ligne travaille en local. Au retour de la connexion :
1. Le device **récupère d'abord l'état distant** (pull).
2. Puis il **pousse ses modifications** (push).

Cet ordre est impératif : toujours pull avant push.

### 4.8 Gestion des conflits

En cas de modifications concurrentes par plusieurs devices, le système effectue une **fusion automatique**.

### 4.9 Plateformes cibles

Toutes les plateformes : iOS, Android, desktop (macOS, Windows, Linux) et web.

## 5. Structure des documents

Chaque document a un **type** qui détermine sa structure. Le type définit les champs, les interactions possibles et le rendu visuel.

L'ajout de nouveaux types de documents se fait par le développeur, dans les releases de l'application. Les utilisateurs ne définissent pas leurs propres types.

### 5.1 Types initiaux

- **Note** : texte riche avec une approche **mobile-first**. Formatage supporté : gras, italique, titres, listes à puces/numérotées, liens, etc. L'éditeur privilégie une expérience tactile fluide tout en offrant le maximum de possibilités de mise en forme compatibles avec les petits écrans.
- **To-do** : liste d'items. Chaque item possède :
  - Un libellé.
  - Un état : en attente, en cours, fini.
  - Un assigné : quel device/participant gère la tâche.
- **Liste de courses** : liste d'entrées. Chaque entrée possède :
  - Un libellé.
  - Une quantité.
  - Un état : acheté ou non.

## 6. Chiffrement et zero-knowledge

### 6.1 Principe général

Le serveur est **zero-knowledge** : il ne connaît aucune information sur le contenu des documents. Ni le texte, ni les métadonnées (titre, type de document, pseudonymes des participants) ne sont lisibles par le serveur. Le serveur manipule uniquement des blobs chiffrés opaques.

### 6.2 Chiffrement au repos

Chaque device chiffre le document stocké en local avec **sa propre clé** (dérivée de sa clé privée liée au document). Le document est donc chiffré au repos sur chaque device, indépendamment des autres participants.

### 6.3 Chiffrement en transit

Les échanges entre devices transitent par le serveur sous forme de **deltas chiffrés**. Seuls les deltas de modification sont transmis, jamais le document complet. Chaque delta est chiffré **avant** d'être envoyé au serveur. Le serveur relaie ces deltas sans pouvoir les déchiffrer.

### 6.4 Échange de clés et jonction

Lors de l'arrivée d'un nouveau device sur un document (via le token d'invitation) :
1. Un **échange de clés** est effectué entre les devices participants, permettant au nouveau device d'obtenir les clés nécessaires pour déchiffrer les deltas.
2. Un device existant lui envoie le **document complet chiffré** (état actuel), relayé par le serveur.

Ce même mécanisme est utilisé lors de la **resynchronisation** d'un device déconnecté (voir §7.2).

## 7. Architecture serveur

Le serveur est un **relais zero-knowledge à rétention bornée**. Il conserve temporairement les deltas chiffrés le temps que les devices destinataires les récupèrent, puis les supprime.

### 7.1 Rétention bornée des deltas

Le serveur garde les deltas chiffrés **en mémoire** dans les limites suivantes :
- **Durée maximale** (X) : un delta non récupéré est supprimé après un temps configurable.
- **Quantité maximale** (Y) : un nombre maximum de deltas en attente par device, au-delà duquel les plus anciens sont supprimés.

Dès qu'un delta a été récupéré par tous les devices concernés, il est immédiatement supprimé.

Le serveur n'a donc jamais de vision complète d'un document. Il ne manipule que des deltas chiffrés transitoires. Les documents eux-mêmes vivent intégralement sur les devices.

### 7.2 Déconnexion d'un device

Lorsqu'une des limites de rétention est atteinte pour un device (il n'a pas récupéré ses deltas à temps, ou trop de deltas se sont accumulés), le serveur :
1. Supprime les deltas en attente pour ce device.
2. Notifie le **premier device actif** (autre que le device concerné) de la déconnexion.
3. Ce device actif **propage l'information de déconnexion** à tous les autres participants.

Le device déconnecté n'est pas exclu du document. À sa reconnexion, il devra effectuer une **resynchronisation complète** auprès d'un device actif (même mécanisme que lors de la phase de jonction initiale).

### 7.2 Déploiement

- **Instance par défaut** : une instance publique est proposée pour un usage immédiat.
- **Auto-hébergement** : les utilisateurs avancés peuvent déployer leur propre instance de serveur.

Le client peut se connecter à **n'importe quel serveur** (adresse configurable). Un même device peut avoir des documents répartis sur **différents serveurs**. Cependant, un document donné ne vit que sur **un seul serveur** : tous les devices participant à ce document passent par le même serveur.
