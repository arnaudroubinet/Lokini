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

Il n'y a pas d'identité globale du device au sens cryptographique. Cependant, un utilisateur peut **lier plusieurs devices** entre eux pour synchroniser ses documents (voir §4.10).

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

Il n'y a pas de mécanisme d'exclusion d'un tiers. Un participant ne peut pas retirer un autre device d'un document. En revanche, un utilisateur peut retirer ses **propres devices liés** d'un document (voir §4.10).

### 4.6 Fork

Un participant peut **forker** un document : il crée une copie indépendante du document et choisit quels autres devices l'accompagnent dans ce fork. Le document original continue d'exister indépendamment.

Le fork est un **nouveau document** à part entière : de nouvelles clés privées/publiques sont générées pour chaque device participant. Les clés du document original ne sont pas réutilisées.

Les devices choisis sont notifiés du fork **via le document original** (le canal de communication existant). Ils n'ont pas besoin d'un nouveau lien d'invitation.

### 4.7 Synchronisation

La synchronisation utilise des **deltas** (différences) pour les échanges. En local, seul le **dernier état** du document est conservé (pas d'historique des versions).

#### Notifications push

Le serveur notifie les devices en **push** lorsqu'un delta les attend. Le serveur stocke les tokens de notification push (FCM/APNs) des devices pour pouvoir les avertir. C'est la seule métadonnée device persistante côté serveur.

#### Mode offline

Un device hors ligne travaille en local. Au retour de la connexion :
1. Le device **récupère d'abord l'état distant** (pull).
2. Puis il **pousse ses modifications** (push).

Cet ordre est impératif : toujours pull avant push.

### 4.8 Gestion des conflits

En cas de modifications concurrentes par plusieurs devices, le système effectue une **fusion automatique**.

### 4.9 Plateformes cibles

Toutes les plateformes : iOS, Android, desktop (macOS, Windows, Linux) et web.

### 4.10 Liaison multi-device (devices d'un même utilisateur)

Un utilisateur possédant plusieurs devices (ex: téléphone + tablette + ordinateur) peut les **lier** entre eux pour synchroniser automatiquement ses documents.

#### Appairage

L'appairage de deux devices se fait via un **lien ou QR code**, de manière identique à la jonction d'un document. L'appairage crée un **canal de synchronisation privé** entre les devices liés : un document système chiffré, invisible pour l'utilisateur, partagé uniquement entre ses devices. Ce canal est hébergé sur un serveur choisi par l'utilisateur (comme tout document).

Le serveur ne sait pas que ces devices appartiennent au même utilisateur. Il voit simplement des devices partageant un document (le canal de sync).

#### Synchronisation automatique

Lorsqu'un device lié **crée ou rejoint** un document, il en informe automatiquement tous ses devices liés via le canal de synchronisation. Le canal transmet uniquement l'**équivalent du lien d'invitation** (le token de jonction). **Aucune clé n'est échangée via ce canal.** Les devices liés rejoignent ensuite le document via le flux normal de jonction (voir §4.4 : échange de clés + transfert du document complet).

Chaque device lié génère ses **propres clés** pour chaque document (le modèle d'identité par document est préservé). Les autres participants du document voient les devices liés comme des participants distincts.

#### Heartbeat et désactivation

Le canal de synchronisation transmet un **heartbeat** : chaque device lié envoie un signal de présence (au maximum **un par jour**). Ce mécanisme permet de détecter les devices inactifs.

Lorsqu'un device n'a pas envoyé de heartbeat depuis un certain temps, les autres devices liés **proposent à l'utilisateur** de désactiver ce device. Si l'inactivité se prolonge au-delà d'un seuil configurable, la désactivation est **forcée automatiquement** : le device est retiré du canal de synchronisation (déliaison).

#### Retrait d'un device lié

Un utilisateur peut **retirer un de ses devices liés** d'un document spécifique. Puisqu'il contrôle le device, il peut :
- Supprimer les clés et les données du document sur ce device.
- Signaler le départ aux autres participants (comme un départ classique, voir §4.5).

Ce retrait ne concerne que le document choisi. Le device reste lié pour tous les autres documents.

#### Déliaison

Un utilisateur peut **délier** un device. Cela :
- Supprime le device du canal de synchronisation.
- Ne retire **pas** le device des documents auxquels il participe déjà (il continue d'y participer de manière indépendante).
- Les futurs documents ne seront plus synchronisés vers ce device.

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

Lors de la **resynchronisation** d'un device déconnecté (voir §7.2), seule l'étape 2 est nécessaire : le device conserve ses clés et reçoit uniquement le document complet à jour.

## 7. Architecture serveur

Le serveur est un **relais zero-knowledge à rétention bornée**. Il conserve temporairement les deltas chiffrés le temps que les devices destinataires les récupèrent, puis les supprime.

### 7.1 Rétention bornée des deltas

Le serveur garde les deltas chiffrés dans **PostgreSQL** dans les limites suivantes :
- **Durée maximale** (X) : un delta non récupéré est supprimé après un temps configurable.
- **Quantité maximale** (Y) : un nombre maximum de deltas en attente par device, au-delà duquel les plus anciens sont supprimés.

Dès qu'un delta a été récupéré par tous les devices concernés, il est immédiatement supprimé.

Le serveur n'a donc jamais de vision complète d'un document. Il ne manipule que des deltas chiffrés transitoires. Les documents eux-mêmes vivent intégralement sur les devices.

### 7.2 Déconnexion d'un device

Lorsqu'une des limites de rétention est atteinte pour un device (il n'a pas récupéré ses deltas à temps, ou trop de deltas se sont accumulés), le serveur :
1. Supprime les deltas en attente pour ce device.
2. Notifie le **premier device actif** (autre que le device concerné) de la déconnexion.
3. Ce device actif **propage l'information de déconnexion** à tous les autres participants.

Le device déconnecté n'est pas exclu du document. Il **conserve ses clés** cryptographiques. À sa reconnexion, il demande une **resynchronisation** : un device actif lui envoie le document complet chiffré (état actuel). Aucun nouvel échange de clés n'est nécessaire.

### 7.3 Déploiement

- **Instance par défaut** : une instance publique est proposée pour un usage immédiat.
- **Auto-hébergement** : les utilisateurs avancés peuvent déployer leur propre instance de serveur.

Le client peut se connecter à **n'importe quel serveur** (adresse configurable). Un même device peut avoir des documents répartis sur **différents serveurs**. Cependant, un document donné ne vit que sur **un seul serveur** : tous les devices participant à ce document passent par le même serveur.
