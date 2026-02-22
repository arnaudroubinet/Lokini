# T012 — CRDT operations (delta generation & application)

## Statut : `pending`

## Description

Implémenter la génération et l'application de deltas CRDT. Les deltas sont des opérations Automerge auto-descriptives et idempotentes, échangées entre devices pour synchroniser les documents.

## Références spécifications

- §4.8 — Deltas (opérations CRDT)
- §4.7 — Synchronisation (deltas)

## Dépendances

- T011 (CrdtDocument wrapper)

## Critères d'acceptation

- [ ] Type `CrdtDelta` (binaire Automerge encapsulé avec métadonnées)
- [ ] Fonction `applyChange(doc, changeFn)` → `{ updatedDoc, delta }`
- [ ] Fonction `applyDelta(doc, delta)` → document mis à jour
- [ ] Fonction `mergeDocs(doc1, doc2)` → document fusionné
- [ ] Les deltas sont idempotents (appliquer deux fois le même delta = même résultat)
- [ ] Les deltas convergent (ordre d'application n'affecte pas le résultat final)
- [ ] Support des modifications concurrentes (merge sans conflit)
- [ ] Couverture ≥ 90%

## Fichier cible

`packages/core/src/crdt/operations.ts`

## Étapes TDD

### Étape 1 — Analyse

- Étudier Automerge change/getChanges/applyChanges/merge
- Comprendre le format binaire des deltas Automerge
- Identifier les scénarios de concurrence
- **Commit** : `T012-step1: analyze CRDT operations`

### Étape 2 — Définition des interfaces

- Définir `CrdtDelta` (bytes + metadata : actorId, seq, timestamp)
- Définir `ChangeFunction<T>` (callback de modification)
- Définir les fonctions d'API publique
- **Commit** : `T012-step2: define CRDT operations interfaces`

### Étape 3 — Écriture des tests

- Tester la modification d'un document et extraction du delta
- Tester l'application d'un delta sur un autre document
- Tester l'idempotence (double application)
- Tester la convergence (deux modifications concurrentes → même résultat final)
- Tester le merge de deux documents divergents
- Tester les modifications de texte riche (Note)
- **Commit** : `T012-step3: write CRDT operations tests`

### Étape 4 — Implémentation

- Implémenter avec Automerge
- Faire passer les tests
- **Commit** : `T012-step4: implement CRDT operations`
