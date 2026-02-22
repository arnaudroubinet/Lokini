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

Le nombre maximum de devices par document est **configurable** (défaut : **40**). Lorsque cette limite est atteinte, toute tentative de jonction est **refusée** avec un message d'erreur explicite. Les tokens d'invitation restent générables mais la jonction échouera tant que la limite est atteinte.

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

Un device rejoint un document via un **lien ou QR code** contenant les informations suivantes :
- **Adresse du serveur** : l'URL du serveur hébergeant le document.
- **Identifiant du document** : référence opaque au document sur le serveur.
- **Token d'invitation** : token unique et à usage unique (one-shot).

Le token possède une **durée de validité** (défaut : **1 heure**, configurable à la création). Passé ce délai, le token est invalide et un nouveau doit être généré.

Ce token déclenche la phase de jonction :
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

#### Protocole de communication

Le client utilise **trois canaux** complémentaires :

1. **REST (HTTPS)** : pour les actions ponctuelles — envoi de deltas, jonction d'un document, récupération de deltas en attente, enregistrement du token push.
2. **WebSocket** : connexion temps réel ouverte **lorsqu'un document est ouvert à l'écran**. Le serveur pousse les deltas instantanément via ce canal. La connexion est fermée quand l'utilisateur quitte le document.
3. **Push notifications (FCM/APNs)** : lorsqu'un delta arrive et que le device n'a pas de WebSocket actif, le serveur envoie une notification push pour réveiller l'application. La notification push contient une référence opaque au document. Le client, à réception, **déchiffre localement** le titre du document pour l'afficher dans la notification (ex : « Document "Liste de courses" modifié »).

C'est toujours le **client qui initie les requêtes** (pull) en REST. Le serveur ne contacte le client que via WebSocket (quand connecté) ou push notification.

#### Identification côté serveur

Le serveur identifie les devices par un couple **{device_id, document_id}**. Ce couple sert à :
- Router les deltas vers les bons destinataires.
- Associer un **token push** (FCM/APNs) pour les notifications.

Le couple {device_id, document_id} et le token push constituent les **seules métadonnées** persistantes côté serveur.

#### Mode offline

Un device hors ligne peut **lire et modifier** ses documents en local. Les modifications sont stockées localement en attente de synchronisation.

Au retour de la connexion :
1. Le device **récupère d'abord l'état distant** (pull).
2. Les modifications locales sont **fusionnées** avec l'état distant via les CRDT (résolution automatique des conflits).
3. Puis le device **pousse ses modifications** (push).

Cet ordre est impératif : toujours pull avant push.

### 4.8 Gestion des conflits

En cas de modifications concurrentes par plusieurs devices, le système effectue une **fusion automatique** basée sur des **CRDT (Conflict-free Replicated Data Types)**.

Les CRDT garantissent la convergence : tous les devices arrivent au même état final quel que soit l'ordre de réception des modifications, sans coordination centrale. Ce choix est cohérent avec l'architecture local-first et le fonctionnement offline.

#### Stratégie par type de document

- **Note (texte riche)** : CRDT séquence pour le texte (type Fugue ou similaire), permettant l'édition concurrente sans perte.
- **To-do** : CRDT map pour les propriétés de chaque item (libellé, état, assigné). L'ajout/suppression d'items utilise un set CRDT avec suppression logique (tombstones). L'**ordre des items** est géré par un CRDT séquence (réordonnancement libre par drag & drop, synchronisé entre participants).
- **Liste de courses** : similaire aux to-do — CRDT map pour les propriétés (libellé, quantité, état acheté). Réordonnancement libre par drag & drop.

#### Deltas

Les deltas échangés entre devices sont des **opérations CRDT** (et non des diffs textuels). Chaque opération est auto-descriptive et peut être appliquée de manière idempotente.

#### Compaction automatique

Les CRDT accumulent des métadonnées internes (vecteurs d'horloge, tombstones de suppression). L'application effectue une **compaction automatique** périodique pour nettoyer ces métadonnées obsolètes et réduire la taille du document en mémoire et sur disque.

#### Limite de taille des documents

Il n'y a pas de limite dure sur la taille d'un document. Cependant, l'application affiche un **avertissement** lorsqu'un document dépasse un seuil configurable (par ex. 1 Mo de contenu texte). Cet avertissement informe l'utilisateur que les performances pourraient se dégrader et suggère de créer un nouveau document ou d'archiver du contenu.

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

Lorsqu'un device n'a pas envoyé de heartbeat depuis **7 jours**, les autres devices liés **proposent à l'utilisateur** de désactiver ce device. Si l'inactivité se prolonge au-delà de **30 jours** (seuil configurable), la désactivation est **forcée automatiquement** : le device est retiré du canal de synchronisation (déliaison).

#### Retrait d'un device lié

Un utilisateur peut **retirer un de ses devices liés** d'un document spécifique. Puisqu'il contrôle le device, il peut :
- Supprimer les clés et les données du document sur ce device.
- Signaler le départ aux autres participants (comme un départ classique, voir §4.5).

Ce retrait ne concerne que le document choisi. Le device reste lié pour tous les autres documents.

#### Signalement de device compromis

Si un device est **perdu ou volé**, l'utilisateur peut le **signaler comme compromis** depuis un autre device lié. Ce signalement déclenche :
1. **Déliaison immédiate** du device compromis (retrait du canal de synchronisation).
2. **Rotation des chain keys** sur tous les documents auxquels le device compromis participait : chaque device restant régénère sa chain key et la distribue aux autres.
3. Le device compromis perd l'accès aux futurs deltas de tous les documents.

Les données déjà présentes sur le device compromis (documents déchiffrés, chain keys passées) restent potentiellement accessibles à un attaquant ayant accès physique au device. Le chiffrement au repos (Argon2id) constitue la dernière ligne de défense.

#### Déliaison

Un utilisateur peut **délier** un device. Cela :
- Supprime le device du canal de synchronisation.
- Ne retire **pas** le device des documents auxquels il participe déjà (il continue d'y participer de manière indépendante).
- Les futurs documents ne seront plus synchronisés vers ce device.

### 4.11 Expérience utilisateur

#### Premier lancement

Au premier lancement, l'utilisateur passe par un **onboarding en trois étapes** :
1. **Pseudonyme** : choix du pseudo global (modifiable ultérieurement).
2. **Configuration serveur** : choix du serveur par défaut (l'instance publique est pré-sélectionnée). Possibilité d'ajouter un serveur auto-hébergé.
3. **Introduction** : présentation rapide des concepts clés (créer un document, inviter quelqu'un, synchroniser ses devices).

#### Écran principal

L'écran principal affiche une **liste unique de tous les documents**, toutes catégories confondues. L'utilisateur peut trier et filtrer cette liste (par type, par date de modification, par nom, etc.).

#### Langues

L'application est disponible en **français** et **anglais** dès le lancement. L'architecture d'internationalisation (i18n) est prévue dès le départ pour faciliter l'ajout de langues ultérieurement.

#### Accessibilité

L'application respecte les standards d'accessibilité **WCAG 2.1 niveau AA** dès le lancement :
- Support complet des **lecteurs d'écran** (ARIA, rôles sémantiques).
- **Contrastes** suffisants dans les deux thèmes (clair et sombre).
- **Navigation clavier** complète (web et desktop).
- Tailles de texte et zones tactiles adaptées.

#### Thème visuel

L'application supporte trois modes d'affichage :
- **Clair**
- **Sombre**
- **Automatique** (suit le réglage du système d'exploitation) — mode par défaut.

## 5. Structure des documents

Chaque document a un **type** qui détermine sa structure. Le type définit les champs, les interactions possibles et le rendu visuel.

### 5.0 Propriétés communes

Chaque document possède les propriétés suivantes, quel que soit son type :

- **Titre** : optionnel. Si non défini par l'utilisateur, un titre est **auto-généré** à partir du type et de la date (ex : « Note du 22/02/2026 », « To-do #3 »). Le titre est modifiable à tout moment.
- **Liste des participants** : chaque participant peut voir la **liste des pseudonymes** des autres devices participant au document.
- **Recherche** : l'application permet une **recherche locale** dans le contenu de tous les documents stockés sur le device (recherche plein texte). La recherche s'effectue entièrement côté client sur les données déchiffrées.

L'ajout de nouveaux types de documents se fait par le développeur, dans les releases de l'application. Les utilisateurs ne définissent pas leurs propres types.

### 5.1 Types initiaux

- **Note** : texte riche avec une approche **mobile-first**. Le texte est représenté en interne sous forme d'**AST (arbre syntaxique)** compatible avec un éditeur de type ProseMirror/TipTap, optimisé pour le travail avec les CRDT. Formatage supporté : gras, italique, titres, listes à puces/numérotées, liens, etc. L'éditeur privilégie une expérience tactile fluide tout en offrant le maximum de possibilités de mise en forme compatibles avec les petits écrans.
- **To-do** : liste d'items. Chaque item possède :
  - Un libellé.
  - Un état : en attente, en cours, fini.
  - Un assigné : un participant sélectionné dans la **liste des participants du document** (par pseudonyme). L'assignation est optionnelle.
- **Liste de courses** : liste d'entrées. Chaque entrée possède :
  - Un libellé.
  - Une quantité.
  - Un état : acheté ou non.

## 6. Chiffrement et zero-knowledge

### 6.1 Principe général

Le serveur est **zero-knowledge** : il ne connaît aucune information sur le contenu des documents. Ni le texte, ni les métadonnées (titre, type de document, pseudonymes des participants) ne sont lisibles par le serveur. Le serveur manipule uniquement des blobs chiffrés opaques.

### 6.2 Choix cryptographiques

Les algorithmes suivants représentent l'état de l'art pour ce type d'architecture :

| Fonction | Algorithme | Justification |
|---|---|---|
| Échange de clés | **X25519** (ECDH sur Curve25519) | Standard moderne, rapide, résistant aux attaques par canaux auxiliaires. |
| Chiffrement symétrique | **XChaCha20-Poly1305** | Chiffrement authentifié. Nonce de 192 bits éliminant le risque de collision de nonce. Performant sans accélération matérielle (important pour mobile). |
| Signatures | **Ed25519** | Chaque device signe ses opérations CRDT pour prouver l'authenticité. Rapide et compact. |
| Dérivation de clés | **HKDF-SHA256** | Dérivation de sous-clés (chiffrement, signature, stockage) à partir de la clé partagée. |
| Chiffrement local (au repos) | **XChaCha20-Poly1305** avec clé dérivée via **Argon2id** | Argon2id protège contre le brute-force si le stockage local est compromis. |
| Hash des tokens | **BLAKE2b** | Hash rapide et sûr pour les tokens d'invitation et identifiants internes. |

### 6.3 Gestion des clés — Sender Keys avec ratchet symétrique

Chaque delta possède **sa propre clé symétrique** de chiffrement. Le mécanisme utilise un **ratchet symétrique** inspiré du protocole Sender Keys (Signal) :

- Chaque device maintient une **chain key** par document. Cette chain key est un secret partagé avec tous les participants du document.
- À chaque envoi de delta, le device dérive une **message key** unique à partir de sa chain key (via HKDF), puis fait avancer la chain key (ratchet). La message key utilisée est supprimée après usage.
- Les autres devices, possédant la même chain key initiale, peuvent dériver les mêmes message keys dans l'ordre pour déchiffrer les deltas.

Ce mécanisme offre une **forward secrecy par message** : la compromission d'une message key ne compromet pas les messages précédents (les chain keys avancent dans un seul sens).

#### Jonction et distribution des chain keys

- À la **création** du document, le device créateur génère sa chain key initiale.
- À la **jonction** d'un nouveau device, il reçoit les chain keys actuelles de tous les devices participants (voir §6.6).
- À la **sortie** d'un device, chaque device restant **régénère sa propre chain key** et la distribue aux autres. Le device parti, ne recevant pas les nouvelles chain keys, ne peut plus déchiffrer les futurs deltas.

### 6.4 Chiffrement au repos

Chaque device chiffre le document stocké en local avec une **clé locale** dérivée via Argon2id à partir d'un secret propre au device. Le document est donc chiffré au repos sur chaque device, indépendamment des autres participants. Les chain keys sont elles-mêmes stockées chiffrées localement.

### 6.5 Chiffrement en transit

Chaque delta CRDT est chiffré avec sa **message key unique** (XChaCha20-Poly1305) dérivée du ratchet symétrique. Chaque delta est également **signé** par le device émetteur (Ed25519) pour garantir l'authenticité et l'intégrité.

Le serveur relaie ces deltas sans pouvoir les déchiffrer. Il ne manipule que des blobs opaques.

### 6.6 Échange de clés et jonction

Lors de l'arrivée d'un nouveau device sur un document (via le token d'invitation) :

1. **Échange X25519** : le nouveau device et un device existant effectuent un échange Diffie-Hellman éphémère. Cela produit un secret partagé temporaire.
2. **Transmission des chain keys** : le device existant chiffre les chain keys actuelles de tous les participants avec le secret partagé et les envoie au nouveau device (via le serveur).
3. **Transfert du document complet** : le device existant envoie l'état actuel complet du document, chiffré avec une clé dérivée du secret partagé, relayé par le serveur.
4. Le nouveau device **génère sa propre chain key** et la distribue à tous les participants existants (via échange X25519 avec chacun).

Lors de la **resynchronisation** d'un device déconnecté (voir §7.2), seule l'étape 3 est nécessaire : le device conserve ses chain keys et reçoit uniquement le document complet à jour. Les chain keys manquées sont retransmises pour rattraper le ratchet.

### 6.7 Vérification d'identité

Les participants d'un document peuvent **vérifier mutuellement leur identité** via une comparaison d'empreintes de clés publiques (similaire au « safety number » de Signal).

Chaque couple de participants possède une **empreinte partagée** dérivée de leurs clés publiques Ed25519. Les utilisateurs peuvent comparer cette empreinte **hors-bande** (en personne, par appel, etc.) pour confirmer qu'aucune attaque man-in-the-middle n'a eu lieu lors de l'échange de clés initial.

L'empreinte est affichée sous forme de **code numérique** ou de **QR code** scannable dans l'interface de l'application.

## 7. Architecture serveur

Le serveur est un **relais zero-knowledge à rétention bornée**. Il conserve temporairement les deltas chiffrés le temps que les devices destinataires les récupèrent, puis les supprime.

### 7.1 Rétention bornée des deltas

Le serveur garde les deltas chiffrés dans **PostgreSQL** dans les limites suivantes :
- **Durée maximale** : un delta non récupéré est supprimé après un temps configurable (défaut : **90 jours**).
- **Quantité maximale** : un nombre maximum de deltas en attente par device, au-delà duquel les plus anciens sont supprimés (défaut : **5 000 deltas**).

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
- **Auto-hébergement** : les utilisateurs avancés peuvent déployer leur propre instance de serveur. Le serveur est distribué sous forme de **Docker Compose** (serveur Quarkus + PostgreSQL), configurable via variables d'environnement.

Le client peut se connecter à **n'importe quel serveur** (adresse configurable). Un même device peut avoir des documents répartis sur **différents serveurs**. Cependant, un document donné ne vit que sur **un seul serveur** : tous les devices participant à ce document passent par le même serveur.

#### Haute disponibilité

Le serveur prévoit un **mode cluster** (multi-instance) pour la haute disponibilité. Plusieurs instances du serveur Quarkus peuvent fonctionner derrière un load balancer, partageant la même base PostgreSQL. Les connexions WebSocket sont gérées via un mécanisme de publication/souscription (pub/sub) entre les instances pour relayer les deltas en temps réel.

#### Observabilité — OpenTelemetry

Le serveur et le client intègrent **OpenTelemetry** pour une observabilité complète, dans le respect du zero-knowledge (aucune donnée de contenu n'est exposée via la télémétrie).

**Côté serveur** :
- **Traces** : suivi des requêtes REST et WebSocket (latence, erreurs, chaîne d'appels).
- **Métriques** : nombre de deltas en file, nombre de documents actifs, nombre de connexions WebSocket, taux d'erreur, latence des requêtes, utilisation mémoire/CPU.
- **Logs structurés** : événements fonctionnels (connexion/déconnexion, jonction, dépassement de seuils) sans jamais journaliser le contenu des deltas.

**Côté client** :
- **Traces** : suivi des opérations de synchronisation (durée pull/push, latence réseau, temps de chiffrement/déchiffrement).
- **Métriques** : taille des documents locaux, nombre d'opérations CRDT, fréquence de compaction, erreurs de synchronisation.

Les données de télémétrie sont exportables vers un collecteur OpenTelemetry standard (configurable). L'envoi de télémétrie est **désactivable** par l'utilisateur (opt-out).

### 7.4 Protection anti-abus

Le serveur applique un **rate limiting** pour se protéger contre les abus :
- Limitation du nombre de requêtes par device/IP par fenêtre de temps.
- Les seuils exacts sont configurables par l'administrateur du serveur.

### 7.5 Suppression de documents

La suppression d'un document est **locale uniquement**. Un utilisateur peut supprimer un document de son device, ce qui :
- Supprime toutes les données locales (document, clés, métadonnées).
- Signale au serveur de ne plus envoyer de deltas pour ce document à ce device.
- **N'affecte pas** les autres participants : ils conservent le document et continuent à le synchroniser normalement.

Il n'existe pas de mécanisme de suppression globale ou de demande de suppression à distance.

Lorsque **tous les devices** ont quitté un document, le serveur conserve les données résiduelles (deltas non récupérés, métadonnées) conformément à la **rétention bornée normale** (90 jours max). Après expiration, les données sont supprimées définitivement.

### 7.6 Export et backup

L'utilisateur peut **exporter un document** sous forme de fichier chiffré (backup). Ce fichier est réimportable uniquement dans l'application Lokini. Il contient :
- Le document complet (état actuel).
- Les clés nécessaires au déchiffrement.
- Les métadonnées locales (pseudonyme, type de document).

Ce mécanisme permet de sauvegarder un document indépendamment du serveur, par exemple avant de quitter un document ou pour archivage personnel.

### 7.7 Versioning du protocole

Chaque message échangé entre client et serveur inclut un **numéro de version du protocole**. Ce versioning permet :

- **Compatibilité ascendante** : un serveur récent peut servir des clients plus anciens (dans la mesure du possible).
- **Détection d'incompatibilité** : si un client utilise une version de protocole trop ancienne, le serveur ou les autres participants l'avertissent et l'invitent à mettre à jour l'application.
- **Évolution contrôlée** : les changements cassants du protocole incrémentent la version majeure. Les clients incompatibles sont informés mais pas exclus silencieusement.

### 7.8 Migration de la base de données

Le schéma PostgreSQL évolue avec les versions du serveur. Les migrations sont gérées de manière **automatique et versionnée** :

- Chaque version du serveur embarque ses **scripts de migration** (via un outil de type Flyway ou Liquibase).
- Au démarrage, le serveur détecte la version actuelle du schéma et applique les migrations nécessaires.
- Les migrations sont **non destructives** : elles ajoutent ou modifient des colonnes/tables sans supprimer de données existantes.
- Un **rollback** est possible vers la version précédente en cas de problème (scripts de migration réversibles).

### 7.9 Scénarios d'erreur

Le système gère les cas d'erreur suivants de manière explicite :

#### Erreurs de jonction
- **Token expiré** : le client affiche un message indiquant que le lien d'invitation a expiré et invite à demander un nouveau lien.
- **Token déjà utilisé** : message d'erreur indiquant que le lien a déjà été utilisé (usage unique).
- **Document plein** (40 devices) : message d'erreur indiquant que le document a atteint sa capacité maximale.
- **Échec d'échange de clés** : si aucun device actif n'est disponible pour effectuer l'échange, le nouveau device est mis en attente. Il réessaie automatiquement à intervalle régulier.

#### Erreurs de synchronisation
- **Serveur injoignable** : le client bascule en mode offline. Les modifications sont stockées localement. La synchronisation reprend automatiquement au retour de la connexion.
- **WebSocket déconnecté** : reconnexion automatique avec backoff exponentiel. Les deltas manqués sont récupérés via REST au rétablissement.
- **Delta corrompu ou invalide** : le delta est rejeté. Le device émetteur est notifié pour renvoi. Si le problème persiste, une resynchronisation complète est déclenchée.
- **Signature invalide** : le delta est rejeté et une alerte de sécurité est affichée à l'utilisateur (possible tentative de falsification).

#### Erreurs de chiffrement
- **Impossibilité de déchiffrer un delta** : si un device ne peut pas déchiffrer un delta (chain key désynchronisée), il demande une **retransmission des chain keys** aux autres participants. En dernier recours, une resynchronisation complète est déclenchée.
- **Clé locale corrompue** : si le chiffrement au repos échoue (clé locale perdue ou corrompue), le document local est marqué comme irrécupérable. L'utilisateur peut demander une resynchronisation complète depuis un autre device.

## 8. Architecture logicielle

### 8.1 Organisation du code — Monorepo

Le projet est organisé en **monorepo** contenant l'ensemble des composants :

```
lokini/
├── packages/
│   ├── core/           # @lokini/core — logique métier partagée
│   ├── web/            # Application React (web)
│   ├── mobile/         # Application React Native (iOS + Android)
│   └── desktop/        # Wrapper Tauri (hors MVP)
├── server/             # Serveur Java Quarkus
└── ...
```

Ce choix permet :
- Le partage de types et interfaces entre client et serveur.
- Des releases coordonnées.
- Une gestion simplifiée des dépendances.

### 8.2 Package partagé — @lokini/core

La logique métier est isolée dans un **package TypeScript indépendant** (`@lokini/core`), utilisé par le client web et le client mobile. Ce package contient :

- **CRDT** : moteur CRDT (opérations, merge, compaction).
- **Crypto** : chiffrement/déchiffrement, gestion des chain keys, ratchet symétrique, signatures.
- **Sync** : logique de synchronisation (pull/push, gestion des deltas, mode offline).
- **Modèles** : types de documents, structures de données partagées.

`@lokini/core` n'a **aucune dépendance** sur l'UI (React) ni sur la plateforme (React Native, browser). Il est testable de manière isolée.

### 8.3 Architecture client — Clean Architecture

Le client suit une **Clean Architecture** en couches, avec des responsabilités clairement séparées :

```
┌──────────────────────────────────────┐
│           Présentation               │  React / React Native
│   (composants UI, écrans, thème)     │  Dépend de : Application
├──────────────────────────────────────┤
│           Application                │  Use cases, state management
│   (cas d'usage, orchestration)       │  Dépend de : Domaine
├──────────────────────────────────────┤
│           Domaine                    │  @lokini/core
│   (CRDT, crypto, sync, modèles)     │  Aucune dépendance externe
├──────────────────────────────────────┤
│           Infrastructure             │  Réseau (REST, WebSocket),
│   (adapters, stockage, réseau)       │  stockage local, push notifications
└──────────────────────────────────────┘
```

**Règle de dépendance** : chaque couche ne dépend que de la couche en dessous. La couche Domaine (`@lokini/core`) est au centre et ne dépend de rien.

- **Présentation** : composants React/React Native, navigation, gestion du thème, i18n. Consomme les use cases de la couche Application.
- **Application** : orchestration des cas d'usage (créer un document, rejoindre, synchroniser). Gère l'état applicatif (store). Fait le lien entre le domaine et l'infrastructure.
- **Domaine** : `@lokini/core`. Contient la logique métier pure (CRDT, crypto, sync). Entièrement testable sans UI ni réseau.
- **Infrastructure** : adapters concrets pour le réseau (client REST, WebSocket), le stockage local (IndexedDB, SQLite), les notifications push. Implémente les interfaces définies par la couche Application.

### 8.4 Architecture serveur — Hexagonale (Ports & Adapters)

Le serveur Java Quarkus suit une **architecture hexagonale** (ports & adapters) :

```
                    ┌─────────────────────┐
   HTTP REST ──────►│                     │◄────── Push (FCM/APNs)
                    │                     │
   WebSocket ──────►│    Domaine métier   │◄────── PostgreSQL
                    │    (ports/usecases) │
   OpenTelemetry ──►│                     │◄────── Pub/Sub (cluster)
                    └─────────────────────┘
```

- **Domaine (centre)** : logique métier du serveur — gestion des deltas, routage vers les devices, rétention bornée, rate limiting. Définit les **ports** (interfaces) pour communiquer avec l'extérieur.
- **Ports entrants (driving)** : API REST (Quarkus RESTEasy), WebSocket (Quarkus WebSockets).
- **Ports sortants (driven)** : PostgreSQL (Quarkus Hibernate/Panache), push notifications (FCM/APNs), pub/sub inter-instances (pour le cluster).
- **Adapters** : implémentations concrètes des ports. Chaque adapter est interchangeable (ex : remplacer PostgreSQL par un autre stockage sans toucher au domaine).

Le domaine métier du serveur est **léger** : le serveur ne fait que relayer des blobs chiffrés. Il n'a aucune connaissance du contenu des documents.

### 8.5 Stratégie de tests

Trois niveaux de tests avec des seuils de couverture différenciés :

#### Tests unitaires
- **Cible** : logique pure — `@lokini/core` (CRDT, crypto, sync), domaine serveur.
- **Seuil** : **90% de couverture** sur le code critique (CRDT, crypto, sync).
- **Caractéristiques** : rapides, sans I/O, exécutés à chaque commit.

#### Tests d'intégration
- **Cible** : interaction entre couches — adapters réseau, stockage local, API REST, WebSocket, PostgreSQL.
- **Seuil** : **70% de couverture** sur le reste du code.
- **Caractéristiques** : testent les adapters avec de vraies dépendances (base de données de test, serveur local).

#### Tests end-to-end (E2E)
- **Cible** : scénarios utilisateur complets — création de document, jonction, synchronisation entre deux clients, mode offline, etc.
- **Caractéristiques** : simulent des interactions réelles entre un client et un serveur. Automatisés mais plus lents.

### 8.6 CI/CD — GitHub Actions

Le pipeline d'intégration continue et de déploiement est géré via **GitHub Actions** :

#### Intégration continue (à chaque push / PR)
1. **Lint** : vérification du style de code (ESLint pour TS, Checkstyle/SpotBugs pour Java).
2. **Tests unitaires** : exécution de tous les tests unitaires avec vérification des seuils de couverture.
3. **Tests d'intégration** : exécution avec services auxiliaires (PostgreSQL via container).
4. **Build** : compilation du client (web) et du serveur (Quarkus).
5. **Tests E2E** : exécution des scénarios end-to-end.

#### Déploiement (sur tag / release)
- **Client web** : build statique déployable.
- **Serveur** : construction de l'image Docker, publication sur un registre de conteneurs.
- **Client mobile** : build via les pipelines spécifiques (Fastlane ou EAS Build) — hors MVP.

## 9. Choix techniques recommandés

Cette section décrit les choix techniques envisagés. Elle est séparée de la spécification fonctionnelle et peut évoluer indépendamment.

### 9.1 Client

- **Mobile** : React Native (iOS + Android)
- **Web / Desktop** : React (web) — desktop via **Tauri** (wrapper léger utilisant la WebView native, binaire compact et performant)
- **Logique partagée** : `@lokini/core` (TypeScript), partagée entre React Native et React Web.

### 9.2 Serveur

- **Langage** : Java
- **Framework** : Quarkus
- **Base de données** : PostgreSQL (stockage des deltas chiffrés et métadonnées opaques)

### 9.3 Observabilité

- **Télémétrie** : OpenTelemetry (traces, métriques, logs structurés) côté serveur et client.
- **Export** : collecteur OpenTelemetry standard (compatible Jaeger, Prometheus, Grafana, etc.).

### 9.4 Bibliothèques clés

*(À compléter — choix de bibliothèque CRDT, bibliothèque crypto, etc.)*

## 10. Licence

Le projet Lokini (client et serveur) est distribué sous licence **AGPL** (GNU Affero General Public License). Ce choix garantit que :
- Le code source reste ouvert et accessible.
- Toute modification ou déploiement (y compris en tant que service réseau) doit partager le code source modifié.
- Les utilisateurs auto-hébergeant le serveur bénéficient des mêmes droits que les utilisateurs de l'instance publique.

## 11. Périmètre MVP (Minimum Viable Product)

Le MVP se concentre sur un périmètre restreint pour valider les fondamentaux de l'application :

### Inclus dans le MVP

- **Type de document** : Notes (texte riche) uniquement. Les types To-do et Liste de courses viendront dans une version ultérieure.
- **Plateforme** : Application **web d'abord**. Les clients mobile (React Native) et desktop (Tauri) suivront après validation du MVP web.
- **Liaison multi-device** : incluse dès le MVP (fonctionnalité clé de l'architecture).
- **Chiffrement de bout en bout** : complet dès le MVP (c'est un principe fondamental, pas une fonctionnalité optionnelle).
- **Synchronisation** : REST + WebSocket + push notifications.
- **Mode offline** : lecture et écriture hors-ligne avec synchronisation au retour.
- **Serveur** : instance publique par défaut + possibilité d'auto-hébergement.

### Reporté après le MVP

- Types de documents supplémentaires (To-do, Liste de courses).
- Clients mobile natifs (React Native).
- Client desktop natif (Tauri).
- Fork de documents.
- Export/backup chiffré.
- Vérification d'identité par empreinte.

## 12. Conformité RGPD et protection des données

L'architecture de Lokini est conçue **privacy by design**, ce qui simplifie significativement la conformité RGPD.

### 12.1 Minimisation des données

Le serveur ne stocke que le **strict minimum** :
- Couples {device_id, document_id} (identifiants opaques).
- Tokens push (FCM/APNs).
- Deltas chiffrés temporaires (supprimés après récupération ou expiration).

Le serveur n'a accès à **aucune donnée personnelle** : pas de noms, pas d'emails, pas d'adresses IP persistantes, pas de contenu de documents.

### 12.2 Droit à l'effacement

- **Côté client** : l'utilisateur peut supprimer ses données locales à tout moment (suppression de documents, désinstallation de l'application).
- **Côté serveur** : les données sont supprimées automatiquement par le mécanisme de rétention bornée (§7.1). Un device quittant un document (§4.5) déclenche la suppression de ses métadonnées associées sur le serveur.

### 12.3 Portabilité des données

L'export chiffré (§7.6) permet à l'utilisateur de récupérer ses données dans un format réimportable.

### 12.4 Pas de profilage

L'architecture zero-knowledge rend le profilage techniquement impossible côté serveur. La télémétrie OpenTelemetry est désactivable (opt-out) et ne contient aucune donnée personnelle.

### 12.5 Base légale

Le traitement des données côté serveur repose sur l'**intérêt légitime** (relais de synchronisation nécessaire au fonctionnement du service). Aucun consentement n'est requis pour le traitement côté serveur puisqu'aucune donnée personnelle n'y est accessible.
