# T016 — Offline queue management

## Statut : `pending`

## Description

Implémenter la gestion de la file d'attente offline. Quand le device est hors ligne, les modifications sont stockées localement. Au retour de la connexion : pull d'abord, merge, puis push.

## Références spécifications

- §4.7 — Mode offline
- §7.9 — Erreurs de synchronisation (serveur injoignable)

## Dépendances

- T014 (SealedDelta)
- T015 (SyncProtocol, SyncSession)

## Critères d'acceptation

- [ ] Type `OfflineQueue` (file ordonnée de deltas locaux en attente)
- [ ] Fonction `enqueueDelta(queue, delta)` → queue mise à jour
- [ ] Fonction `dequeueAll(queue)` → `{ deltas, emptyQueue }`
- [ ] Fonction `getQueueSize(queue)` → nombre de deltas en attente
- [ ] Fonction `createResyncPlan(queue, remoteState)` → plan de réconciliation
- [ ] Les deltas sont persistés dans l'ordre de création
- [ ] La queue supporte plusieurs documents simultanément
- [ ] Gestion du retour en ligne : pull → merge → push (orchestration)
- [ ] Couverture ≥ 90%

## Fichier cible

`packages/core/src/sync/offline.ts`

## Étapes TDD

### Étape 1 — Analyse

- Modéliser la file offline (par document)
- Définir le flux de réconciliation au retour en ligne
- Identifier les cas limites (queue pleine, deltas obsolètes)
- **Commit** : `T016-step1: analyze offline queue management`

### Étape 2 — Définition des interfaces

- Définir `OfflineQueue`, `QueuedDelta`
- Définir `ResyncPlan`
- Définir les fonctions d'API publique
- **Commit** : `T016-step2: define offline queue interfaces`

### Étape 3 — Écriture des tests

- Tester l'ajout de deltas à la queue
- Tester le dequeue (FIFO)
- Tester la queue multi-document
- Tester la création d'un plan de resync
- Tester le flux complet offline → online
- **Commit** : `T016-step3: write offline queue tests`

### Étape 4 — Implémentation

- Implémenter la queue et le plan de resync
- Faire passer les tests
- **Commit** : `T016-step4: implement offline queue management`
