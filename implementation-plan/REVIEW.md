# Revue des spécifications de tâches — Lokini MVP

**Date** : 2026-02-22
**Portée** : 66 tâches (T001–T066) vérifiées contre `SPECIFICATIONS.md` et `CLAUDE.md`

---

## Résumé exécutif

La revue a identifié **8 tâches manquantes**, **1 tâche à scinder**, **12 tâches à enrichir**, et **6 dépendances manquantes**. Le plan passe de **66 à 74 tâches**.

---

## 1. Tâches manquantes (à créer)

### T067 — Create document use case (server)

**Problème** : T032 expose `POST /api/v1/documents` mais aucun use case serveur ne gère la création d'un document. T018 (driving ports) ne définit pas de `CreateDocumentUseCase`.

**Impact** : Sans ce use case, le endpoint REST n'a rien à appeler côté domaine.

**Phase** : 5 (Server Domain)

### T068 — Create invitation use case (server)

**Problème** : T032 expose `POST /api/v1/documents/{docId}/invitations` mais aucun use case ne gère la création de tokens d'invitation. Le token doit être haché (BLAKE2b), avoir une durée de validité, et être stocké.

**Impact** : Impossible de générer des invitations sans ce use case.

**Phase** : 5 (Server Domain)

### T069 — Chain key distribution protocol (core)

**Problème** : §6.3 décrit en détail la distribution des chain keys : à la jonction (le nouveau device reçoit les chain keys existantes), à la sortie (chaque device restant régénère sa chain key), et au signalement de device compromis. T009 couvre la mécanique du ratchet mais pas le protocole de distribution.

**Impact** : Sans protocole de distribution, la jonction et le départ ne peuvent pas fonctionner au niveau cryptographique.

**Phase** : 4 (Sync Logic)

### T070 — Invitation link format & parsing (core)

**Problème** : §4.4 définit le contenu du lien d'invitation (adresse serveur + identifiant document + token). Ce format doit être défini dans `@lokini/core` pour être partagé entre T046 (join côté web), T056 (UI de partage) et le futur client mobile.

**Impact** : Chaque tâche qui manipule des liens d'invitation réinventerait le format.

**Phase** : 1 (Core Models)

### T071 — Device secret generation & management (core)

**Problème** : T010 (Argon2id) utilise un `deviceSecret` pour dériver la clé locale, mais nulle part ce secret n'est défini, généré ou stocké. §6.4 mentionne « un secret propre au device ».

**Impact** : Le chiffrement au repos ne peut pas fonctionner sans gestion du secret device.

**Phase** : 2 (Crypto Primitives)

### T072 — Navigation & routing (web)

**Problème** : Aucune tâche ne couvre la configuration du routeur React (React Router ou équivalent), la structure des routes (`/`, `/documents/:id`, `/join/:token`, `/settings`, `/onboarding`), ni la navigation entre pages.

**Impact** : Les pages (T053, T054, T055, T058) ne peuvent pas être accessibles sans routing.

**Phase** : 10 (Web Presentation)

### T073 — Error notification system (web)

**Problème** : §7.9 définit de nombreux scénarios d'erreur avec des messages utilisateur spécifiques (token expiré, signature invalide, serveur injoignable, delta corrompu...). Aucune tâche ne couvre le système de notification d'erreurs (toast/snackbar/bannière).

**Impact** : Les erreurs seraient silencieuses ou gérées de manière incohérente.

**Phase** : 10 (Web Presentation)

### T074 — ProseMirror-Automerge bridge (web)

**Problème** : T055 couvre à la fois l'éditeur ProseMirror ET l'intégration CRDT. C'est l'une des parties les plus complexes du projet — synchroniser l'état ProseMirror avec Automerge en temps réel, gérer les curseurs distants, appliquer les deltas sans perdre la position du curseur.

**Impact** : Tâche issue du split de T055 (voir section 2).

**Phase** : 10 (Web Presentation)

---

## 2. Tâche à scinder

### T055 → T055 + T074

**T055 actuel** couvre : éditeur ProseMirror + barre d'outils + intégration CRDT + deltas distants + thème + accessibilité.

**Problème** : C'est deux domaines très distincts :
1. **L'éditeur ProseMirror** (UI, schema, toolbar, raccourcis, mobile-first) — expertise UI/UX
2. **Le bridge ProseMirror ↔ Automerge** (transformer les transactions ProseMirror en opérations Automerge et vice-versa, gérer les curseurs) — expertise CRDT/data

**Nouveau découpage** :
- **T055** : Éditeur ProseMirror basique (schema, toolbar, formatage, raccourcis, mobile-first, thème, accessibilité). Produit un éditeur fonctionnel en local sans CRDT.
- **T074** : Bridge ProseMirror ↔ Automerge (transformation bidirectionnelle des opérations, application de deltas distants sans perte de curseur, gestion de la convergence).

---

## 3. Tâches existantes à enrichir

### T001 — Device identity model

**Ajouts** :
- Mentionner les clés privées explicitement dans les critères d'acceptation (pas seulement les clés publiques)
- Ajouter le type `DeviceSecret` (référence vers T071 pour l'implémentation)
- Ajouter la distinction entre clés d'identité document et clés éphémères (jonction)

### T019 — Driven ports

**Ajouts** :
- Ajouter l'interface `DocumentRepository` (create, findById, delete, existsById). T027 définit la table et T030 implémente, mais l'interface du port est absente.

### T022 — Join document use case (server)

**Ajouts** :
- Ajouter le rôle du serveur comme relais dans l'échange de clés (§6.6) : le serveur relaie les messages chiffrés entre le nouveau device et un device existant
- Ajouter le critère : « Relayer les messages d'échange de clés entre le nouveau device et un device existant (blobs opaques) »

### T025 / T026 — Clarification des frontières

**Problème** : T025 (delta retention/cleanup) et T026 (device disconnection) se chevauchent. Les deux gèrent la détection de devices déconnectés et la notification.

**Clarification** :
- **T025** : Nettoyage programmé (batch/cron) — suppression des deltas expirés, application des limites de quantité. Responsabilité = maintenance.
- **T026** : Détection événementielle — quand un nouveau delta arrive pour un device dont les limites sont déjà atteintes, déclencher la notification immédiate et le flux de resynchronisation. Responsabilité = temps réel.

### T035 — Rate limiting

**Ajouts** :
- Ajouter le rate limiting sur les connexions WebSocket (pas seulement REST)
- Mentionner la protection contre les abus de connexion/déconnexion rapides

### T038 — Application ports

**Corrections** :
- Corriger le fichier cible : `packages/web/src/application/ports/` au lieu de `packages/web/src/application/usecases/`

### T043 — Device store

**Ajouts** :
- Ajouter les dépendances manquantes : T005 (X25519), T007 (Ed25519)
- `createIdentityForDocument` doit générer les paires de clés X25519 et Ed25519

### T047 — Edit document use case

**Ajouts** :
- Ajouter la dépendance T014 (delta packaging) — le delta doit être scellé (chiffré + signé) avant d'être mis en file d'attente
- Ajouter le critère : « Scellement du delta via sealDelta avant mise en file »

### T048 — Sync document use case

**Ajouts** :
- Ajouter la dépendance T014 (delta packaging) — pour ouvrir les deltas reçus et sceller les deltas envoyés

### T049 — Leave document use case (web)

**Ajouts** :
- Ajouter le critère de régénération de la chain key (§6.3) et distribution aux participants restants
- Ajouter la dépendance T069 (chain key distribution)

### T054 — Document list page

**Corrections** :
- Le critère « Recherche plein texte locale dans les titres » doit être étendu à « Recherche plein texte locale dans le contenu de tous les documents » (§5.0)

### T055 — Note editor (scope réduit)

**Modifications** :
- Retirer les critères liés au CRDT (déplacés dans T074)
- Focus uniquement sur l'éditeur ProseMirror pur : schema, toolbar, formatage, raccourcis, accessibilité, thème

---

## 4. Dépendances manquantes

| Tâche | Dépendance manquante | Raison |
|-------|---------------------|--------|
| T032 | T067 (CreateDocumentUseCase) | Le endpoint REST doit appeler un use case |
| T032 | T068 (CreateInvitationUseCase) | Le endpoint d'invitation doit appeler un use case |
| T043 | T005, T007 | La création d'identité nécessite la génération de clés |
| T047 | T014 | Le delta doit être scellé avant d'être mis en file |
| T048 | T014 | Les deltas reçus doivent être ouverts, les envoyés scellés |
| T049 | T069 | Le départ nécessite la régénération de la chain key |
| T055 | T074 (nouveau) | L'éditeur est intégré au bridge CRDT via T074 |
| T074 | T055, T012 | Le bridge dépend de l'éditeur et des opérations CRDT |

---

## 5. Récapitulatif des modifications

### Nouvelles tâches (8)
| ID | Nom | Phase |
|----|-----|-------|
| T067 | Create document use case (server) | 5 |
| T068 | Create invitation use case (server) | 5 |
| T069 | Chain key distribution protocol | 4 |
| T070 | Invitation link format & parsing | 1 |
| T071 | Device secret generation & management | 2 |
| T072 | Navigation & routing (web) | 10 |
| T073 | Error notification system (web) | 10 |
| T074 | ProseMirror-Automerge bridge | 10 |

### Tâches enrichies (12)
T001, T019, T022, T025, T026, T035, T038, T043, T047, T048, T049, T054

### Tâche scindée (1)
T055 → T055 (réduit) + T074 (nouveau)

### Bilan
- **Avant** : 66 tâches
- **Après** : 74 tâches
- **Tâches modifiées** : 13 (12 enrichies + 1 réduite)

---

## 6. Impact sur le graphe de dépendances

### Phase 1 (Core Models) : +1 tâche
```
T001 → T002 → T003
               T070 (nouveau, dépend de T002)
```

### Phase 2 (Crypto) : +1 tâche
```
T004, T005, T006, T007, T008, T009, T010
T071 (nouveau, dépend de T010)
```

### Phase 4 (Sync) : +1 tâche
```
T014, T015, T016
T069 (nouveau, dépend de T005, T006, T009)
```

### Phase 5 (Server Domain) : +2 tâches
```
T017–T026
T067 (nouveau, dépend de T018, T019)
T068 (nouveau, dépend de T018, T019, T008)
```

### Phase 10 (Web Presentation) : +3 tâches
```
T051–T058
T072 (nouveau, dépend de T053, T054, T055, T058)
T073 (nouveau, dépend de T051, T052)
T074 (nouveau, dépend de T055, T012, T047)
```
