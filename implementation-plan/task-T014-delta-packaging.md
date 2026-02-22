# T014 — Delta packaging (encrypt/sign/serialize)

## Statut : `pending`

## Description

Implémenter le packaging complet d'un delta CRDT pour le transit : chiffrement avec la message key du ratchet, signature Ed25519 pour l'authenticité, sérialisation pour l'envoi. Et l'opération inverse : vérification, déchiffrement, désérialisation.

## Références spécifications

- §6.5 — Chiffrement en transit
- §6.3 — Gestion des clés (message key)
- §4.8 — Deltas

## Dépendances

- T006 (XChaCha20-Poly1305)
- T007 (Ed25519 signatures)
- T009 (Symmetric ratchet — message key)
- T012 (CrdtDelta)

## Critères d'acceptation

- [ ] Type `SealedDelta` (delta chiffré + signé + métadonnées de routing)
- [ ] Fonction `sealDelta(delta, ratchetState, signingKey)` → `{ sealedDelta, newRatchetState }`
- [ ] Fonction `openDelta(sealedDelta, ratchetState, verifyKey)` → `{ delta, newRatchetState }`
- [ ] Le delta est chiffré avec la message key dérivée du ratchet
- [ ] Le delta est signé par le device émetteur
- [ ] La signature est vérifiée avant déchiffrement
- [ ] Rejet si signature invalide (alerte sécurité)
- [ ] Rejet si déchiffrement échoue (chain key désynchronisée)
- [ ] Format sérialisé compact et versionné
- [ ] Couverture ≥ 90%

## Fichier cible

`packages/core/src/sync/delta.ts`

## Étapes TDD

### Étape 1 — Analyse

- Définir le format wire du SealedDelta
- Séquencer les opérations : sign → encrypt (ou encrypt → sign ?)
- Identifier les métadonnées nécessaires (documentId, deviceId, sequence number)
- **Commit** : `T014-step1: analyze delta packaging`

### Étape 2 — Définition des interfaces

- Définir `SealedDelta` (format sérialisé)
- Définir `SealOptions` et `OpenOptions`
- Définir les fonctions : `sealDelta`, `openDelta`
- **Commit** : `T014-step2: define delta packaging interfaces`

### Étape 3 — Écriture des tests

- Tester seal → open round-trip
- Tester le rejet avec signature invalide
- Tester le rejet avec mauvaise clé de déchiffrement
- Tester que le ratchet avance après seal/open
- Tester le format sérialisé (version, taille)
- **Commit** : `T014-step3: write delta packaging tests`

### Étape 4 — Implémentation

- Implémenter seal et open
- Faire passer les tests
- **Commit** : `T014-step4: implement delta packaging`
