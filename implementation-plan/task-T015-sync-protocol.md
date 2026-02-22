# T015 — Sync protocol (pull/push state machine)

## Statut : `pending`

## Description

Implémenter la logique du protocole de synchronisation pull/push. Ordre impératif : toujours pull avant push. Gère la machine à états de synchronisation, la réconciliation avec l'état distant, et le push des modifications locales.

## Références spécifications

- §4.7 — Synchronisation (protocole pull/push)
- §4.7 — Mode offline (pull → merge → push)
- §7.7 — Versioning du protocole

## Dépendances

- T014 (SealedDelta, sealDelta, openDelta)

## Critères d'acceptation

- [ ] Type `SyncState` (enum : idle, pulling, merging, pushing, error)
- [ ] Type `SyncSession` (état courant, deltas en attente, deltas à pousser)
- [ ] Fonction `createSyncSession(documentId, localState)` → session
- [ ] Fonction `processPull(session, remotDeltas)` → session mise à jour + deltas à appliquer
- [ ] Fonction `preparePush(session, localDeltas)` → session + deltas à envoyer
- [ ] Invariant : pull toujours avant push
- [ ] Numéro de version du protocole inclus dans chaque message
- [ ] Gestion des erreurs : delta corrompu, signature invalide, resync nécessaire
- [ ] Couverture ≥ 90%

## Fichier cible

`packages/core/src/sync/protocol.ts`

## Étapes TDD

### Étape 1 — Analyse

- Modéliser la machine à états de synchronisation
- Définir le format des messages protocole (avec versioning)
- Identifier les scénarios : sync normal, conflit, resync complète
- **Commit** : `T015-step1: analyze sync protocol`

### Étape 2 — Définition des interfaces

- Définir `SyncState`, `SyncSession`, `SyncMessage`
- Définir `ProtocolVersion`
- Définir les fonctions d'API publique
- **Commit** : `T015-step2: define sync protocol interfaces`

### Étape 3 — Écriture des tests

- Tester le flux normal : pull → merge → push
- Tester le rejet de push sans pull préalable
- Tester la gestion de deltas corrompus
- Tester le versioning du protocole
- Tester la détection de besoin de resync complète
- **Commit** : `T015-step3: write sync protocol tests`

### Étape 4 — Implémentation

- Implémenter la machine à états
- Faire passer les tests
- **Commit** : `T015-step4: implement sync protocol`
