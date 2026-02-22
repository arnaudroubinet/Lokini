# T059 — Linking protocol (core)

## Statut : `pending`

## Description

Implémenter le protocole d'appairage de devices dans @lokini/core. L'appairage crée un canal de synchronisation privé (document système chiffré) entre les devices liés.

## Références spécifications

- §4.10 — Liaison multi-device (appairage)
- §4.10 — Synchronisation automatique

## Dépendances

- T005 (X25519 key exchange)
- T006 (XChaCha20-Poly1305 encryption)
- T009 (Chain key / ratchet)

## Critères d'acceptation

- [ ] Type `LinkingChannel` (document système invisible)
- [ ] Fonction `initiateLinking()` → invitation d'appairage
- [ ] Fonction `acceptLinking(invitation)` → canal établi
- [ ] Le canal transmet uniquement les tokens de jonction (pas les clés)
- [ ] Chaque device lié génère ses propres clés pour chaque document
- [ ] Le serveur ne sait pas que les devices sont liés
- [ ] Couverture ≥ 90%

## Fichier cible

`packages/core/src/sync/` (nouveau fichier `linking.ts`)

## Étapes TDD

### Étape 1 — Analyse

- Modéliser le protocole d'appairage
- Définir le format du canal de synchronisation
- **Commit** : `T059-step1: analyze linking protocol`

### Étape 2 — Définition des interfaces

- Définir les types et fonctions
- **Commit** : `T059-step2: define linking protocol interfaces`

### Étape 3 — Écriture des tests

- Tester l'initiation et l'acceptation
- Tester la transmission de tokens
- Tester l'indépendance des clés
- **Commit** : `T059-step3: write linking protocol tests`

### Étape 4 — Implémentation

- Implémenter le protocole
- Faire passer les tests
- **Commit** : `T059-step4: implement linking protocol`
